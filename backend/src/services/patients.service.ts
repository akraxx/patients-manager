import {Patient, PatientResultSet} from '../../../common/patient.model';

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

    public getPatients(searchTerms: string[], sort: string, sortType: string, limit: number, offset: number): Promise<PatientResultSet> {
        logger.info(`searching for patients with terms ${searchTerms}, sort ${sort}:${sortType}, limit ${limit}, offset ${offset}`);

        if (!searchTerms) {
            searchTerms = []
        }

        const options: PatientSearchOptions = {}

        searchTerms
            .forEach(term => {
                const t = term.split('=')
                options[t[0]] = t[1]
            });

        let operator = "$or";
        let filters: any[] = [];


        Object.keys(options).forEach(function (key) {
            const filterRegex = {
                "$regex": new RegExp(options[key].toString().toLowerCase(), 'i')
            };
            filters.push({[key]: filterRegex})
        });

        let condition = {};
        if (filters.length > 0) {
            condition = {[operator]: filters}
        }





        return this.patientDao.find(condition)
            .populate({
                path: 'consultations.office',
                model: 'Office'
            })
            .collation({locale: "fr", strength: 1})
            .sort({[sort]: this.sortTypeToNumber(sortType)})
            .skip(offset)
            .limit(limit)
            .exec()
            .then(patients => {
                return this.patientDao.countDocuments(condition)
                    .then(c => {
                        logger.debug(`number of matching documents ${c}`)
                        return new PatientResultSet(c, patients);
                    });
            })
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
        return this.patientDao.findOne({_id: id})
            .populate({
                path: 'consultations.office',
                model: 'Office'
            })
            .then(patient => {
                if(!patient) {
                    throw new Error(`no patient with id ${id}`)
                }

                return patient;
            })
            .catch((e: Error) => {
                logger.error(`could not get patient with id ${id} got error ${e.message}`)
                throw e;
            });
    }

    public deletePatient(id: string, deletedBy: string): Promise<Patient> {
        logger.info(`deleting patient with id ${id} by ${deletedBy}`);
        return this.getPatientById(id)
            .then(patient => {
                if(patient.createdBy !== deletedBy) {
                    throw new Error(`patient has been created by ${patient.createdBy}, could not delete it`);
                }

                return this.patientDao.findOneAndDelete({_id: id});
            })
            .then(d => d)
            .catch((e: Error) => {
                logger.error(`could not get patient with id ${id} got error ${e.message}`);
                throw e;
            });

    }

}