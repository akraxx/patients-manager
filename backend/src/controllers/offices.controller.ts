import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    interfaces,
    principal,
    request,
    requestParam,
} from 'inversify-express-utils';
import {inject} from 'inversify';
import {TYPES} from '../constants/types';
import * as express from 'express';
import {Office} from '../../../common/office.model';
import {Principal} from '../auth/principal';
import {logger} from '../logger/logger';
import {OfficesService} from '../services/offices.service';

@controller('/api/offices')
export class OfficesController implements interfaces.Controller {

    constructor(@inject(TYPES.OfficesService) private officesService: OfficesService) {

    }

    @httpGet("/")
    private list(@request() req: express.Request): Promise<Office[]> {
        logger.info(`get list of offices`)
        return this.officesService.getOffices();
    }

    @httpPost("/")
    private create(@request() req: express.Request): Promise<Office> {
        logger.info(`create a new office`)
        return this.officesService.createOffice(req.body as Office);
    }

    @httpPut("/:id")
    private update(@requestParam("id") id: string, @request() req: express.Request): Promise<Office> {
        logger.info(`update office with id ${id}`)
        return this.officesService.updateOffice(id, req.body as Office);
    }

    @httpGet("/:id")
    private async getById(@principal() user: Principal, @requestParam("id") id: string): Promise<Office> {
        logger.info(`get office with id ${id}`)
        return this.officesService.getOfficeById(id);
    }
}