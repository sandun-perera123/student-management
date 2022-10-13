import { Response, Request } from 'express';
let chaiHttp = require('chai-http');
let expressServer = require('../index');
let chai = require('chai');
let should = require('chai').should();
chai.use(chaiHttp);

describe('POST /api/register', () => {
      it('it should return 204 response code', (done) => {

            const requestBody = {
                  "teacher": "thilan+10@gmail.com",
                  "students": [
                        "kasun+10@gmail.com"
                  ]
            }

            chai.request(expressServer)
                  .post('/api/register')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        //should.exist(res.body);
                        res.should.have.status(204);
                        done();
                  });
      });

      it('it should return 400 when teacher is not defined', (done) => {

            const requestBody = {
                  "teacher": "",
                  "students": [
                        "kasun+10@gmail.com"
                  ]
            }

            chai.request(expressServer)
                  .post('/api/register')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        should.exist(res.body);
                        res.should.have.status(400);
                        res.body.error.should.be.eql("Teacher should be defniend");
                        done();
                  });
      });

      it('it should return 400 when no students are defined', (done) => {

            const requestBody = {
                  "teacher": "kasun+10@gmail.com",
                  "students": []
            }

            chai.request(expressServer)
                  .post('/api/register')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        should.exist(res.body);
                        res.should.have.status(400);
                        res.body.error.should.be.eql("There should be at least one student");
                        done();
                  });
      });
})

describe('GET /api/commonstudents', () => {
      it('it should return 200 response code and response body when valid teacher emails are passing', (done) => {
            const searchParams = "?teacher=sandun@gmail.com"
            chai.request(expressServer)
                  .get('/api/commonstudents' + searchParams)
                  .end((err: any, res: any) => {
                        console.log("----- body", res.body)
                        res.should.have.status(200);
                        done()
                  });
      });

      it('it should return 200 response code and response body when invalid teacher email is passed', (done) => {
            const searchParams = "?teacher=invalid@gmail.com"
            chai.request(expressServer)
                  .get('/api/commonstudents' + searchParams)
                  .end((err: any, res: any) => {
                        res.should.have.status(204);
                        done()
                  });
      });
})

describe('POST /api/suspend', () => {
      it('it should return 204 response code when passing valid student email', (done) => {

            const requestBody = {
                  "student": "sandamali@gmail.com"
            }

            chai.request(expressServer)
                  .post('/api/suspend')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(204);
                        done()
                  });
      });

      it('it should return 400 response code when passing invalid student email', (done) => {

            const requestBody = {
                  "student": "sandamali+1@gmail.com"
            }

            chai.request(expressServer)
                  .post('/api/suspend')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(400);
                        done()
                  });
      });

})

describe('POST /api/retrievefornotifications', () => {
      it('it should return 200 response code when passing valid teacher email', (done) => {

            const requestBody = {
                  "teacher": "sandun@gmail.com",
                  "notification": "Hello students!"
            }

            chai.request(expressServer)
                  .post('/api/retrievefornotifications')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(200);
                        done()
                  });
      });

      it('it should return 400 response code when passing invalid teacher email', (done) => {

            const requestBody = {
                  "teacher": "sanduninvalid@gmail.com",
                  "notification": "Hello students!"
            }

            chai.request(expressServer)
                  .post('/api/retrievefornotifications')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(400);
                        done()
                  });
      });

})