import * as express from 'express'
import {controller, httpGet, interfaces, request, response} from 'inversify-express-utils';
import fs from 'fs';

const VERSION_FILEPATH = process.env.VERSION_FILEPATH || 'version.json';

@controller('/version')
export class VersionController implements interfaces.Controller {

    @httpGet("/")
    private index(@request() req: express.Request, @response() res: express.Response, next: express.NextFunction): string {
        return JSON.parse(fs.readFileSync(VERSION_FILEPATH, "utf8"));
    }
}