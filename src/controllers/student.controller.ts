import { Request, Response } from 'express';
import {StudentRepository} from '../repositories/student.repository'

export default class StudentController {

    private studentRepository: StudentRepository

    constructor() {
        this.studentRepository = new StudentRepository()
    }

    test() {
        console.log("test")
    }
}