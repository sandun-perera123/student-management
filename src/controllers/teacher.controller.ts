import { Request, Response } from 'express';
import { TeacherService } from '../services/teacher.service'

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

        try {
            const teacherEmail = req.body.teacher
            const studentEmails = Array.isArray(req.body.students) ? req.body.students : [req.body.students]

            if (!teacherEmail) return res.status(400).send({ error: "Teacher should be defined" });
            if (!studentEmails) return res.status(400).send({ error: "Students should be defined" });
            if (studentEmails.length === 0) return res.status(400).send({ error: "There should be at least one student" });

            await this.teacherService.registerStudents(teacherEmail, studentEmails);

            res.status(204).send()
        } catch (error) {
            console.log("Error occurred : ", error)
        }
    }

    async getCommonStudents(req: Request, res: Response) {
        try {
            const teacherEmails: any = Array.isArray(req.query.teacher) ? req.query.teacher : [req.query.teacher]
            const response = await this.teacherService.getCommonStudents([...teacherEmails])

            let statusCode = 0

            if (response.length) {
                statusCode = 200
            } else {
                statusCode = 204
            }

            res.status(statusCode).send({
                "students": response
            })
        } catch (error) {
            console.log("Error occurred : ", error)
        }
    }

    async suspendStudent(req: Request, res: Response) {
        try {
            const studentEmail = req.body.student
            const response = await this.teacherService.suspendStudent(studentEmail)

            if (response[0]) {
                res.status(204).send()
            } else {
                res.status(400).send({
                    "error": "invalid student email provided"
                })
            }
        } catch (error) {
            console.log("Error occurred : ", error)
        }
    }

    async getStudentsForNotification(req: Request, res: Response) {
        try {
            const teacherEmail = req.body.teacher
            const notification = req.body.notification

            // Check if the teacher email is valid
            const teacher = await this.teacherService.getTeacherByEmail(teacherEmail);
            if (teacher === null) {
                return res.status(400).send({
                    "error": "Invalid email provided for teacher"
                })
            }
            const uniqueStudentEmails : any = await this.teacherService.getStudentsForNotification(teacherEmail, notification)

            res.status(200).send({
                "recipients": Array.from(uniqueStudentEmails)
            })
        } catch (error) {
            console.log("Error occurred : ", error)
        }
    }
}