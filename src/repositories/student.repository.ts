// @ts-ignores
import {Student} from '../models/student.model'

export class StudentRepository {
    constructor() { }

    async getByEmail(studentEmail: string) {
        return await Student.findOne({ where: { email: studentEmail } });
    }

    findOrCreateStudents(studentEmails: string) {

    }

}
