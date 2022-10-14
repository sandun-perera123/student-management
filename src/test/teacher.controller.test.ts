import { Response, Request } from 'express';
let chaiHttp = require('chai-http');
let expressServer = require('../index');

import TeacherController from '../controllers/teacher.controller'

let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);


describe('TeacherController', () => {

      it('it should return 204 response code for valid teacher email with 1 student emails', (done) => {

            const teacherController = new TeacherController()

            const requestBody = {
                  "teacher": "teacher1@gmail.com",
                  "students": [
                        "student1@gmail.com"
                  ]
            }



      });

})