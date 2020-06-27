import * as express from 'express'
import {controller, httpGet, httpPost, httpPut, interfaces, request, requestParam} from 'inversify-express-utils';
import {inject} from 'inversify';
import {PatientSearchOptions, PatientsService} from '../services/patients.service';
import {Patient} from '../../../common/patient.model';
import {TYPES} from '../constants/types';

@controller('/api/patients')
export class PatientController implements interfaces.Controller {

    constructor(@inject(TYPES.PatientsService) private patientsService: PatientsService) {

    }

    @httpGet("/")
    private list(@request() req: express.Request): Promise<Patient[]> {
        return this.patientsService.getPatients(req.query as PatientSearchOptions);
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