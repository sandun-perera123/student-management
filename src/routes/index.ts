import { Router } from 'express';
import  TeacherController  from '../controllers/teacher.controller';
import  StudentController  from '../controllers/student.controller';

export default class MainRouter {

    router: Router;
    teacherController: TeacherController;
    studentController: StudentController;

    constructor() {

        this.teacherController = new TeacherController();
        this.studentController = new StudentController();

        // Initialize router object
        this.router = Router({ mergeParams: true });
        this.teacherRoutes();
        this.studentRoutes();

    }

    private teacherRoutes() {
        this.router.route('/api/register')
            .post(this.teacherController.assignStudents);
        this.router.route('/api/commonstudents')
            .get(this.teacherController.getCommonStudents);
        this.router.route('/api/suspend')
            .post(this.teacherController.suspendStudent);
        this.router.route('/api/retrievefornotifications')
            .post(this.teacherController.getStudentsForNotification);
    }

    private studentRoutes() {
        this.router.route('/students')
            .post(this.studentController.test);
    }


}