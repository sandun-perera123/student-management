const Teacher = require('../models').Teacher
const Student = require('../models').Student
import Sequelize from 'sequelize'

export class TeacherRepository {

    async registerStudents(teacherEmail: string, studentEmails: Array<string>) {

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

    async getStudentsForNotification(teacherEmail : string, studentEmails: string[]){
        console.log("------------ teacherEmail",teacherEmail)
        console.log("------------ studentEmails",studentEmails)
    }

    async getTeacherByEmail(teacherEmail: string){
        return await Teacher.findOne({
            where : {
                email : teacherEmail
            }
        })
    }

}


