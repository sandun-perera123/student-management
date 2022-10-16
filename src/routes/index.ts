import { Router } from 'express';
import  TeacherController  from '../controllers/teacher.controller';
import  {TeacherService}  from '../services/teacher.service';

export default class MainRouter {

    router: Router;
    teacherController: TeacherController;

    constructor() {

        this.teacherController = new TeacherController(new TeacherService());
        
        // Initialize router object
        this.router = Router({ mergeParams: true });
        this.teacherRoutes();

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


}