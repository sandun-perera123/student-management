import { Response, Request } from 'express';
let chaiHttp = require('chai-http');
let expressServer = require('../index');
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

// Defining global server object
let server: any = null
before(async () => {
      server = await chai.request(expressServer).keepOpen()
});

describe('POST /api/register', () => {
      it('it should return 204 response code for valid teacher email with 1 student emails', (done) => {

            const requestBody = {
                  "teacher": "teacher1@gmail.com",
                  "students": [
                        "student1@gmail.com",
                        "student2@gmail.com"
                  ]
            }

            server
                  .post('/api/register')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(204);
                        done();
                  });
      });

      it('it should return 204 response code for valid teacher email with multiple student emails', (done) => {

            const requestBody = {
                  "teacher": "teacher2@gmail.com",
                  "students": [
                        "student3@gmail.com",
                        "student4@gmail.com"
                  ]
            }

            server
                  .post('/api/register')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(204);
                        done();
                  });
      });

      it('it should return 400 when teacher is not defined in request body', (done) => {

            const requestBody = {
                  "teacher": "",
                  "students": [
                        "kasun+10@gmail.com"
                  ]
            }

            server
                  .post('/api/register')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        should.exist(res.body);
                        res.should.have.status(400);
                        res.body.error.should.be.eql("Teacher should be defined");
                        done();
                  });
      });

      it('it should return 400 when no students are defined in request body', (done) => {

            const requestBody = {
                  "teacher": "kasun+10@gmail.com",
                  "students": []
            }

            server
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
            const searchParams = "?teacher=teacher1@gmail.com"
            server
                  .get('/api/commonstudents' + searchParams)
                  .end((err: any, res: any) => {
                        res.body.should.have.property("students")
                        expect(res.body).to.deep.equal({
                              "students": [
                                    "student1@gmail.com",
                                    "student2@gmail.com"
                              ]
                        })
                        res.should.have.status(200);
                        done()
                  });
      });

      it('it should return 200 response code and response body when invalid teacher email is passed', (done) => {
            const searchParams = "?teacher=invalid@gmail.com"
            server
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

            server
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

            server
                  .post('/api/suspend')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(400);
                        done()
                  });
      });

})

describe('POST /api/retrievefornotifications', () => {
      it('it should return 200 response code when passing valid teacher email no @mentions', (done) => {

            const requestBody = {
                  "teacher": "teacher1@gmail.com",
                  "notification": "Hello students!"
            }

            server
                  .post('/api/retrievefornotifications')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(200);
                        done()
                  });
      });

      it('it should return 400 response code when passing invalid teacher email with no @mentions', (done) => {

            const requestBody = {
                  "teacher": "invalid@gmail.com",
                  "notification": "Hello students!"
            }

            server
                  .post('/api/retrievefornotifications')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        res.should.have.status(400);
                        done()
                  });
      });

      it('it should return 200 response code when passing valid teacher email with @mentions', (done) => {

            const requestBody = {
                  "teacher": "teacher1@gmail.com",
                  "notification": "Hello students! @student3@gmail.com"
            }

            server
                  .post('/api/retrievefornotifications')
                  .send(requestBody)
                  .end((err: any, res: any) => {
                        expect(res.body).to.deep.equal({
                              "recipients": [
                                    "student1@gmail.com",
                                    "student2@gmail.com",
                                    "student3@gmail.com"
                              ]
                        })
                        res.should.have.status(200);
                        done()
                  });
      });


})

after(async () => {
      server.close()
});