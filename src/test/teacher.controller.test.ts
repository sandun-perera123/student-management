let chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
import sinon from 'sinon'
import TeacherController from '../controllers/teacher.controller'
import { TeacherService } from '../services/teacher.service'

let chai = require('chai');
let expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiAsPromised);


describe('TeacherController - Assign students to a teacher', () => {

    it('it should return true for valid teacher email with 1 valid student email', async () => {

        const teacherEmail = "teacher1@gmail.com"
        const students = [
            "student1@gmail.com"
        ]

        const teacherService = new TeacherService()
        sinon.stub(teacherService, 'registerStudents').callsFake(function fakeReturnFunction() {
            return new Promise((resolve, reject) => {
                resolve(true)
            })
        });

        const teacherController = new TeacherController(teacherService)
        const result = await teacherController.assignStudentsHandler(teacherEmail, students)
        expect(result).to.be.true
    });

    it('it should return true for valid teacher email with 2 valid student emails', async () => {

        const teacherEmail = "teacher1@gmail.com"
        const students = [
            "student1@gmail.com",
            "student2@gmail.com"
        ]

        const teacherService = new TeacherService()
        sinon.stub(teacherService, 'registerStudents').callsFake(function fakeReturnFunction() {
            return new Promise((resolve, reject) => {
                resolve(true)
            })
        });

        const teacherController = new TeacherController(teacherService)
        const result = await teacherController.assignStudentsHandler(teacherEmail, students)
        expect(result).to.be.true
    });

    it('it should throw an Error when teacher is not defined in request body', async () => {

        try {
            const teacherEmail = ""
            const students = [
                "student1@gmail.com",
                "student2@gmail.com"
            ]

            const teacherService = new TeacherService()
            sinon.stub(teacherService, 'registerStudents').callsFake(function fakeReturnFunction() {
                return new Promise((resolve, reject) => {
                    resolve(true)
                })
            });

            const teacherController = new TeacherController(teacherService)
            await teacherController.assignStudentsHandler(teacherEmail, students)

        } catch (error: any) {
            expect(error).to.be.a('Error');
            expect(error.message).to.be.equals("Teacher email is not defined");
        }

    })

    it('it should thorw an Error when no students are defined in request body', async () => {

        try {
            const teacherEmail = "teacher1@gmail.com"
            const students: string[] = []

            const teacherService = new TeacherService()
            sinon.stub(teacherService, 'registerStudents').callsFake(function fakeReturnFunction() {
                return new Promise((resolve, reject) => {
                    resolve(true)
                })
            });

            const teacherController = new TeacherController(teacherService)
            await teacherController.assignStudentsHandler(teacherEmail, students)

        } catch (error: any) {
            expect(error).to.be.a('Error');
            expect(error.message).to.be.equals("There should be at least one student");
        }

    });

    it('it should thorw an Error when teacher email is not defined in request body', async () => {

        try {
            const teacherEmail = ""
            const students: string[] = []

            const teacherService = new TeacherService()
            sinon.stub(teacherService, 'registerStudents').callsFake(function fakeReturnFunction() {
                return new Promise((resolve, reject) => {
                    resolve(true)
                })
            });

            const teacherController = new TeacherController(teacherService)
            await teacherController.assignStudentsHandler(teacherEmail, students)

        } catch (error: any) {
            expect(error).to.be.a('Error');
            expect(error.message).to.be.equals("Teacher email is not defined");
        }

    });

})


describe('TeacherController - Get common students', () => {

    it('it should return student emails array when passing valid teacher emails.', async () => {

        const teacherEmails = [
            "teacher1@gmail.com"
        ]

        const teacherService = new TeacherService()
        sinon.stub(teacherService, 'getCommonStudents').callsFake(function fakeReturnFunction() {
            return new Promise((resolve, reject) => {
                resolve([
                    "student1@gmail.com",
                    "student2@gmail.com"
                ])
            })
        });

        sinon.stub(teacherService, 'getTeacherByEmail').callsFake(function fakeGetTeacherByEmail() {
            return new Promise((resolve, reject) => {
                resolve(["teacher1@gmail.com"])
            })
        });

        const teacherController = new TeacherController(teacherService)
        const result = await teacherController.getCommonStudentsHandler(teacherEmails)
        expect(result).to.be.an('array').to.eql([
            "student1@gmail.com",
            "student2@gmail.com"
        ])


    });

    it('it should throw an Error for invalid teacher email', async () => {

        try {

            const teacherEmails = [
                "invalid@gmail.com"
            ]

            const teacherService = new TeacherService()
            sinon.stub(teacherService, 'getTeacherByEmail').callsFake(function fakeGetTeacherByEmail() {
                return new Promise((resolve, reject) => {
                    resolve(null)
                })
            });

            sinon.stub(teacherService, 'getCommonStudents').callsFake(function fakeGetCommonStudents() {
                return new Promise((resolve, reject) => {
                    resolve([
                        "student1@gmail.com",
                        "student2@gmail.com"
                    ])
                })
            });

            const teacherController = new TeacherController(teacherService)
            await teacherController.getCommonStudentsHandler(teacherEmails)

        } catch (error: any) {
            expect(error.message).to.be.equals("Invalid teacher email");
        }

    });

})


describe('TeacherController - Suspend student', () => {

    it('it should return true for valid student email', async () => {
        const studentEmail = "student1@gmail.com"

        const teacherService = new TeacherService()
        sinon.stub(teacherService, 'getStudentByEmail').callsFake(function fakeGetStudentByEmail() {
            return new Promise((resolve, reject) => {
                resolve([
                    "student1@gmail.com"
                ])
            })
        });

        sinon.stub(teacherService, 'suspendStudent').callsFake(function fakeSuspendStudent() {
            return new Promise((resolve, reject) => {
                resolve(true)
            })
        });

        const teacherController = new TeacherController(teacherService)
        const result = await teacherController.suspendStudentHandler(studentEmail)
        expect(result).to.be.true
    });

    it('it should throw an Error for invalid student email', async () => {
        try {
            const studentEmail = "invalid@gmail.com"

            const teacherService = new TeacherService()
            sinon.stub(teacherService, 'getStudentByEmail').callsFake(function fakeGetStudentByEmail() {
                return new Promise((resolve, reject) => {
                    resolve(null)
                })
            });

            sinon.stub(teacherService, 'suspendStudent').callsFake(function fakeSuspendStudent() {
                return new Promise((resolve, reject) => {
                    resolve(true)
                })
            });

            const teacherController = new TeacherController(teacherService)
            await teacherController.suspendStudentHandler(studentEmail)

        } catch (error: any) {
            expect(error).to.be.a('Error')
            expect(error.message).to.be.equals("Invalid student email provided");
        }
    });

})

describe('TeacherController - Get students for notifications', () => {

    it('it should return student emails array for valid teacher email without @mentions', async () => {
        const studentEmail = "teacher1@gmail.com"
        const notification = "hello all"

        const teacherService = new TeacherService()
        sinon.stub(teacherService, 'getTeacherByEmail').callsFake(function fakeGetTeacherByEmail() {
            return new Promise((resolve, reject) => {
                resolve([
                    "teacher1@gmail.com"
                ])
            })
        });

        sinon.stub(teacherService, 'getStudentsForNotification').callsFake(function fakeGetStudentsForNotification() {
            return new Promise((resolve, reject) => {
                resolve([
                    "student1@gmail.com",
                    "student2@gmail.com"
                ])
            })
        });

        const teacherController = new TeacherController(teacherService)
        const result = await teacherController.getStudentsForNotificationHandler(studentEmail, notification)
        expect(result).to.be.an('array').to.eql([
            "student1@gmail.com",
            "student2@gmail.com"
        ])

    });

    it('it should throw an error when passing invalid teacher email with no @mentions', async () => {

        try {
            const studentEmail = "invalid@gmail.com"
            const notification = "hello all"

            const teacherService = new TeacherService()
            sinon.stub(teacherService, 'getTeacherByEmail').callsFake(function fakeGetTeacherByEmail() {
                return new Promise((resolve, reject) => {
                    resolve(null)
                })
            });

            const teacherController = new TeacherController(teacherService)
            await teacherController.getStudentsForNotificationHandler(studentEmail, notification)

        } catch (error: any) {
            expect(error).to.be.a('Error')
            expect(error.message).to.be.equals("Invalid teacher email provided")
        }

    });

    it('it should return array with student emails when passing valid teacher email with @mentions', async () => {

        const studentEmail = "teacher1@gmail.com"
        const notification = "hello all student1@gmail.com @student2@gmail.com"

        const teacherService = new TeacherService()
        sinon.stub(teacherService, 'getTeacherByEmail').callsFake(function fakeGetTeacherByEmail() {
            return new Promise((resolve, reject) => {
                resolve([
                    "teacher1@gmail.com"
                ])
            })
        });

        sinon.stub(teacherService, 'getStudentsForNotification').callsFake(function fakeGetStudentsForNotification() {
            return new Promise((resolve, reject) => {
                resolve([
                    "student1@gmail.com",
                    "student2@gmail.com"
                ])
            })
        });

        const teacherController = new TeacherController(teacherService)
        const result = await teacherController.getStudentsForNotificationHandler(studentEmail, notification)
        expect(result).to.be.an('array').to.eql([
            "student1@gmail.com",
            "student2@gmail.com"
        ])

    });

})