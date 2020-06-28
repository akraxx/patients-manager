import {logger} from '../logger/logger';
import mongoose, {ConnectionOptions, Mongoose} from 'mongoose';
import {inject, injectable} from 'inversify';
import {TYPES} from '../constants/types';
import {MongoOptions} from './mongo.options';
import {PatientSchema, PatientType} from '../models/patient.dao';

export type MongoServiceProvider = () => Promise<MongoService>;


@injectable()
export class MongoService {

    private _mongoose: Promise<mongoose.Mongoose>

    constructor(@inject(TYPES.MongoOptions) private mongoOptions: MongoOptions) {
        logger.info(`connect to mongodb ${mongoOptions.host}:${mongoOptions.port}, db ${mongoOptions.db}`)
        this._mongoose = this.init()
    }

    private init(): Promise<Mongoose> {
        const dbURI = `mongodb://${this.mongoOptions.host}:${this.mongoOptions.port}/${this.mongoOptions.db}`;

        const db = mongoose.connection

        mongoose.set('debug', function (collectionName: any, method: any, query: any, doc: any, options: any) {
            logger.debug(`${collectionName}.${method} ${JSON.stringify(query)} ${JSON.stringify(doc)} ${options}`);
        });

        db.on('connecting', function () {
            logger.info('connecting to MongoDB...');
        });

        db.on('error', function (error: any) {
            logger.error('Error in MongoDb connection: ' + error);
            mongoose.disconnect();
        });

        db.on('connected', function () {
            logger.info('MongoDB connected!');
        });

        db.once('open', function () {
            logger.info('MongoDB connection opened!');
        });

        db.on('reconnected', function () {
            logger.info('MongoDB reconnected!');
        });

        db.on('disconnected', function () {
            logger.warn('MongoDB disconnected!');
            setTimeout(function () {
                mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectionOptions)
            }, 5000);
        });

        return mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectionOptions)
    }

    public async patient(): Promise<mongoose.Model<PatientType>> {
        return this._mongoose
            .then(m => m.model<PatientType>('Patient', PatientSchema))
    }

}