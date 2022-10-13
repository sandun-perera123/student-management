import { Request, Response } from 'express';
import {TeacherRepository} from '../repositories/teacher.repository'
import {StudentRepository} from '../repositories/student.repository'

export default class TeacherController {

    private teacherRepository: TeacherRepository
    private studentRepository: StudentRepository

    constructor() {
        this.teacherRepository = new TeacherRepository()
        this.studentRepository = new StudentRepository()

        this.assignStudents = this.assignStudents.bind(this)
        this.getCommonStudents = this.getCommonStudents.bind(this)
        this.suspendStudent = this.suspendStudent.bind(this)
        this.getStudentsForNotification = this.getStudentsForNotification.bind(this)
    }

    async assignStudents(req: Request, res: Response) {

        const teacherEmail = req.body.teacher
        const studentEmails = req.body.students

        if (!teacherEmail) res.status(400).send({ error: "Teacher should be defniend" });
        if (!studentEmails) res.status(400).send({ error: "Students should be defniend" });
        if (studentEmails.length === 0) res.status(400).send({ error: "There should be at least one student" });

        this.teacherRepository.registerStudents(teacherEmail, studentEmails);

        res.status(204).send()
    }

    async getCommonStudents(req: Request, res: Response) {
        const teacherEmails : any  = Array.isArray(req.query.teacher) ? req.query.teacher : [req.query.teacher]
        const response = await this.teacherRepository.getCommonStudents([...teacherEmails])

        let statusCode = 0

        if(response.length){
            statusCode = 200
        }else{
            statusCode = 204
        }

        res.status(statusCode).send({
            "students" : response
        })
    }

    async suspendStudent(req: Request, res: Response) {
        const studentEmail = req.body.student
        const response = await this.teacherRepository.suspendStudent(studentEmail)

        if(response[0]){
            res.status(204).send()
        }else{
            res.status(400).send({
                "error" : "invalid student email provided"
            })
        }
    }

    async getStudentsForNotification(req: Request, res: Response){
        const  teacherEmail = req.body.teacher
        const notification = req.body.notification
        let studetEmailsFromNotification : string[] = []

        // Check if the teacher email is valid
        const teacher = await this.teacherRepository.getTeacherByEmail(teacherEmail);
        if(teacher === null){
            res.status(400).send({
                "error" : "Invalid email provided for teacher"
            })
        }

        notification.split(' ').forEach((word:string) => {
            if (word[0] === '@') {
                let studentEmail = word.substr(1);
                studetEmailsFromNotification.push(studentEmail);
            }
        });
        
        // Get all students who are registed under specified teacher
        const studetEmailsOfTeacher = await this.teacherRepository.getCommonStudents([teacherEmail])
        const allStudentEmails = studetEmailsOfTeacher.concat(studetEmailsFromNotification)
        const uniqueStudentEmails : Set<string> = new Set(allStudentEmails)

        res.status(200).send({
            "recipients" : Array.from(uniqueStudentEmails)
        })
    }
}