const Teacher = require('../models').Teacher
const Student = require('../models').Student
import Sequelize from 'sequelize'

export class TeacherService {

    async registerStudents(teacherEmail: string, studentEmails: Array<string>){

        const [teacher, created] = await Teacher.findOrCreate({
            where: { email: teacherEmail },
            defaults: {
                email: teacherEmail
            }
        })
        
        studentEmails.forEach(async studentEmail => {

            const [student, created] = await Student.findOrCreate({
                where: { email: studentEmail },
                defaults: {
                    email: studentEmail,
                    is_suspended: 0
                }
            })
            student.addTeacher(teacher);
        })

        return true
    }

    async getCommonStudents(teacherEmails: Array<string>) {
        
        const students : [] = await Student.findAll({
            attributes : ["email"],
            include: [{
                model:Teacher, 
                attributes: [],
                where: {
                    email : {
                        [Sequelize.Op.in]: teacherEmails
                    }
                }
            }]
        })

        const studentsArr : any[] = students.map((student:any) => student.email)
        return studentsArr
    }

    async suspendStudent(studentEmail : string){
        return await Student.update(
            {is_suspended:1},
            {where:{email : studentEmail}}
        )
    }

    async getStudentsForNotification(teacherEmail : string, notification: string){

        let studetEmailsFromNotification : string[] = []

        notification.split(' ').forEach((word:string) => {
            if (word[0] === '@') {
                let studentEmail = word.substr(1);
                studetEmailsFromNotification.push(studentEmail);
            }
        });
        
        // Get all students who are registed under specified teacher
        const studetEmailsOfTeacher = await this.getCommonStudents([teacherEmail])
        const allStudentEmails = studetEmailsOfTeacher.concat(studetEmailsFromNotification)
        return allStudentEmails
    }

    async getTeacherByEmail(teacherEmail: string){
        return await Teacher.findOne({
            where : {
                email : teacherEmail
            }
        })
    }

    async getStudentByEmail(studentEmail: string){
        return await Student.findOne({
            where : {
                email : studentEmail
            }
        })
    }

}


