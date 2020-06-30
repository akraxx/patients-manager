import {Patient} from '../../../common/patient.model';

import {inject, injectable} from 'inversify';
import {logger} from '../logger/logger';
import {TYPES} from '../constants/types';
import {PatientType} from '../models/patient.dao';
import {MongoServiceProvider} from '../db/mongo.service';
import {Model} from 'mongoose';
import {OfficeType} from '../models/office.dao';
import {Office} from '../../../common/office.model';
import VError from 'verror';

@injectable()
export class OfficesService {
    private officeDao: Model<OfficeType>

    constructor(@inject(TYPES.MongoServiceProvider) private mongoService: MongoServiceProvider) {
        this.mongoService().then(m => m.office().then(dao => this.officeDao = dao));
    }

    public getOffices(): Promise<Office[]> {
        return this.officeDao.find()
            .then(offices => offices)
            .catch(e => {
                console.error('could not get offices, got error', e)
               throw e;
            });
    }

    public createOffice(office: Office): Promise<Office> {
        logger.info(`creating new office...`);
        return this.officeDao.create(office)
            .then(o => {
                logger.info(`office ${office.name} has been created with id ${office._id}`);
                return o;
            })
            .catch((e: Error) => {
                throw new VError(e, `could not create office ${office.name} got error`);
            });
    }

    public updateOffice(id: string, office: Office): Promise<Office> {
        logger.info(`updating office with id ${id}`);
        return this.officeDao.updateOne({_id: id}, {$set: office}, {runValidators: true, new: false})
            .then(d => {
                logger.info(`office ${id} has been updated, result : ${JSON.stringify(d)}`);
                return this.getOfficeById(id)
                    .then(p => p);
            })
            .catch((e: Error) => {
                throw new VError(e, `could not update office ${id} with values ${JSON.stringify(office)}`);
            });
    }

    public getOfficeById(id: string): Promise<Office> {
        logger.info(`getting office with id ${id}`);
        return this.officeDao.findById(id)
            .then(d => d)
            .catch((e: Error) => {
                throw new VError(e, `could not get patient with id ${id}`);
            });
    }

}