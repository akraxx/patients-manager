import {inject, injectable} from 'inversify';
import {TYPES} from '../constants/types';
import {PatientsService} from './patients.service';
import {Consultation, Patient} from '../../../common/patient.model';
import {NotFoundError} from '../error/NotFoundError';
import {logger} from '../logger/logger';

@injectable()
export class ConsultationsService {

    constructor(@inject(TYPES.PatientsService) private patientsService: PatientsService) {

    }

    public async getConsultations(patientId: string): Promise<Consultation[]> {
        logger.info(`getting all consultations of ${patientId}`);
        return this.patientsService.getPatientById(patientId)
            .then(p => p.consultations);
    }

    public async getConsultation(patientId: string, id: number, patient?: Patient): Promise<Consultation> {

        logger.info(`getting consultation ${id} of ${patientId}`);
        if (!patient) {
            patient = await this.patientsService.getPatientById(patientId)
        }

        const consultation = patient.consultations.find(c => c.id == id);
        if(!consultation) {
            throw new NotFoundError('There is no consultation with id ' + id);
        }
        return consultation;
    }

}