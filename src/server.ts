import express from 'express';
import bodyParser from 'body-parser';
import mainRouter from './routes';

export default class Server {

    expressInstance: express.Express;

    constructor() {
        this.expressInstance = express();
        this.middlewareSetup();
        this.routingSetup();
    }

    private middlewareSetup() {
        this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
        this.expressInstance.use(bodyParser.json());
    }

    private routingSetup() {
        let router = new mainRouter().router;
        this.expressInstance.use('/', router);
    }

}