import { Request, Response } from 'express';
import {TeacherService} from '../services/teacher.service'

export default class TeacherController {

    private teacherService: TeacherService

    constructor() {
        this.teacherService = new TeacherService()

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

        this.teacherService.registerStudents(teacherEmail, studentEmails);

        res.status(204).send()
    }

    async getCommonStudents(req: Request, res: Response) {
        const teacherEmails : any  = Array.isArray(req.query.teacher) ? req.query.teacher : [req.query.teacher]
        const response = await this.teacherService.getCommonStudents([...teacherEmails])

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
        const response = await this.teacherService.suspendStudent(studentEmail)

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

        // Check if the teacher email is valid
        const teacher = await this.teacherService.getTeacherByEmail(teacherEmail);
        if(teacher === null){
            res.status(400).send({
                "error" : "Invalid email provided for teacher"
            })
        }
        const uniqueStudentEmails = await this.teacherService.getStudentsForNotification(teacherEmail, notification)

        res.status(200).send({
            "recipients" : Array.from(uniqueStudentEmails)
        })
    }
}