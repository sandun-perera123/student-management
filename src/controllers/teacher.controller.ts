import { Request, Response } from 'express';
import { TeacherService } from '../services/teacher.service'

export default class TeacherController {

    constructor(private teacherService: TeacherService) {
        this.teacherService = teacherService

        this.assignStudents = this.assignStudents.bind(this)
        this.getCommonStudents = this.getCommonStudents.bind(this)
        this.suspendStudent = this.suspendStudent.bind(this)
        this.getStudentsForNotification = this.getStudentsForNotification.bind(this)
    }

    async assignStudents(req: Request, res: Response) {

        try {
            const teacherEmail = req.body?.teacher || ''
            const studentEmails = Array.isArray(req.body.students) ? req.body.students : [req.body.students]
            await this.assignStudentsHandler(teacherEmail, studentEmails)
            res.status(204).send()

        } catch (error) {
            res.status(400).send({
                "error": error
            })
        }
    }

    async getCommonStudents(req: Request, res: Response) {
        try {
            const teacherEmails: any = Array.isArray(req.query.teacher) ? req.query.teacher : [req.query.teacher]
            const response = await this.getCommonStudentsHandler([...teacherEmails])

            if (response.length) {
                res.status(200).send({
                    "students": response
                })
            } else {
                res.status(204).send()
            }

        } catch (error : any) {
            res.status(400).send({
                "error":error.message
            })
            console.log("Error occurred : ", error)
        }
    }

    async suspendStudent(req: Request, res: Response) {
        try {
            const studentEmail = req.body.student
            await this.suspendStudentHandler(studentEmail)
            res.status(204).send()
        } catch (error: any) {
            res.status(400).send({
                "error":error.message
            })
            console.log("Error occurred : ", error)
        }
    }

    async getStudentsForNotification(req: Request, res: Response) {
        try {
            const teacherEmail = req.body.teacher
            const notification = req.body.notification

            const uniqueStudentEmails = await this.getStudentsForNotificationHandler(teacherEmail, notification)
            if(!uniqueStudentEmails){
                res.status(204).send()
            }

            res.status(200).send({
                "recipients": uniqueStudentEmails
            })

        } catch (error: any) {
            res.status(400).send({
                "error":error.message
            })
            console.log("Error occurred : ", error)
        }
    }


    async assignStudentsHandler(teacherEmail: string, studentEmails: string[]) {
        if (!teacherEmail) throw new Error("Teacher email is not defined")
        if (!studentEmails) throw new Error("Student emails are not defined")
        if (studentEmails.length === 0) throw new Error("There should be at least one student")
        return await this.teacherService.registerStudents(teacherEmail, studentEmails);
    }

    async getCommonStudentsHandler(teacherEmails: string[]) {

        for (const teacherEmail of teacherEmails) {
            const teacher = await this.teacherService.getTeacherByEmail(teacherEmail)
            if (teacher == null) {
                throw new Error("Invalid teacher email")
            }
        }

        const response = await this.teacherService.getCommonStudents(teacherEmails)
        return response
    }

    async suspendStudentHandler(studentEmail: string) {
        const student = await this.teacherService.getStudentByEmail(studentEmail)
        if (student == null) {
            throw new Error("Invalid student email provided")
        }
        return await this.teacherService.suspendStudent(studentEmail)
    }

    async getStudentsForNotificationHandler(teacherEmail: string, notification: string) {
        const teacher = await this.teacherService.getTeacherByEmail(teacherEmail);
        if (!teacher) {
            throw new Error("Invalid teacher email provided")
        }
        let emails = await this.teacherService.getStudentsForNotification(teacherEmail, notification)
        const uniqueStudentEmails  = new Set(emails)
        const uniqueStudentEmailsArr = Array.from(uniqueStudentEmails)
        return uniqueStudentEmailsArr
    }

}