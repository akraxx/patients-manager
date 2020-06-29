import * as express from 'express'
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    interfaces,
    queryParam,
    request,
    requestParam,
} from 'inversify-express-utils';
import {inject} from 'inversify';
import {PatientSearchOptions, PatientsService} from '../services/patients.service';
import {Patient, PatientResultSet} from '../../../common/patient.model';
import {TYPES} from '../constants/types';

@controller('/api/patients')
export class PatientController implements interfaces.Controller {

    constructor(@inject(TYPES.PatientsService) private patientsService: PatientsService) {

    }

    @httpGet("/")
    private list(@request() req: express.Request,
                 @queryParam("sort") sort: string = "createdAt",
                 @queryParam("sortType") sortType: string = "desc",
                 @queryParam("limit") limit: string,
                 @queryParam("offset") offset: string): Promise<PatientResultSet> {
        return this.patientsService.getPatients(req.query.search as string[], sort, sortType, +limit, +offset);
    }

    @httpPost("/")
    private create(@request() req: express.Request): Promise<Patient> {
        return this.patientsService.createPatient(req.body as Patient);
    }

    @httpPut("/:id")
    private update(@requestParam("id") id: string, @request() req: express.Request): Promise<Patient> {
        return this.patientsService.updatePatient(id, req.body as Patient);
    }

    @httpGet("/:id")
    private getById(@requestParam("id") id: string): Promise<Patient> {
        return this.patientsService.getPatientById(id);
    }

}