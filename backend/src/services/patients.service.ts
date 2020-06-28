import {Patient} from '../../../common/patient.model';

import {inject, injectable} from 'inversify';
import {logger} from '../logger/logger';
import {TYPES} from '../constants/types';
import {PatientType} from '../models/patient.dao';
import {MongoServiceProvider} from '../db/mongo.service';
import {Model} from 'mongoose';

export interface PatientSearchOptions { [key: string]: string; }

@injectable()
export class PatientsService {
    private patientDao: Model<PatientType>

    constructor(@inject(TYPES.MongoServiceProvider) private mongoService: MongoServiceProvider) {
        this.mongoService().then(m => m.patient().then(dao => this.patientDao = dao));
    }

    private sortTypeToNumber(sortType: string): number {
        return (sortType === 'desc') ? -1 : 1;
    }

    public getPatients(options: PatientSearchOptions): Promise<Patient[]> {
        logger.info(`searching for patients with options ${JSON.stringify(options)}`);

        let operator = "$or";
        let filters: any[] = [];

        let specialFilters = ['sort', 'sortType'];

        Object.keys(options).forEach(function (key) {
            if (specialFilters.indexOf(key) < 0) {
                const filterRegex = {
                    "$regex": new RegExp(options[key].toString().toLowerCase(), 'i')
                };
                filters.push({[key]: filterRegex})
            } else {
                logger.debug(`${key} can not be used as search parameter`)
            }
        });

        let condition = {};
        if (filters.length > 0) {
            condition = {[operator]: filters}
        }

        let sort: {} = {'createdAt': -1};
        if (options.sort) {
            if (options.sortType) {
                sort = {[options.sort.toString()]: this.sortTypeToNumber(options.sortType.toString())}
            }
        }

        return this.patientDao.find(condition)
            .collation({locale: "fr", strength: 1})
            .sort(sort)
            .exec()
            .then(patients => patients)
            .catch(e => {
                console.error('could not get patients, got error', e)
               throw e;
            });
    }

    public createPatient(patient: Patient): Promise<Patient> {
        logger.info(`creating new patient...`);
        return this.patientDao.create(patient)
            .then(d => {
                console.log('patient', d.firstName, d.lastName, 'has been created with id', d._id);
                return d;
            })
            .catch((e: Error) => {
                console.error('could not create patient ', patient, 'got error', e)
                throw e;
            });
    }

    public updatePatient(id: string, patient: Patient): Promise<Patient> {
        logger.info(`updating patient with id ${id}`);
        return this.patientDao.updateOne({_id: id}, {$set: patient}, {runValidators: true, new: false})
            .then(d => {
                logger.info(`patient ${id} has been updated, result : ${JSON.stringify(d)}`);
                return this.getPatientById(id)
                    .then(p => p);
            })
            .catch((e: Error) => {
                logger.error(`could not create patient ${JSON.stringify(patient)} got error ${e.message}`)
                throw e;
            });
    }

    public getPatientById(id: string): Promise<Patient> {
        logger.info(`getting patient with id ${id}`);
        return this.patientDao.findById(id)
            .populate({
                path: 'consultations.office',
                model: 'Office'
            })
            .then(d => d)
            .catch((e: Error) => {
                logger.error(`could not get patient with id ${id} got error ${e.message}`)
                throw e;
            });
    }

}