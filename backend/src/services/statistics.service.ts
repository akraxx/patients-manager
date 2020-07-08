import {inject, injectable} from 'inversify';
import {Model, Types} from 'mongoose';
import {PatientType} from '../models/patient.dao';
import {TYPES} from '../constants/types';
import {MongoServiceProvider} from '../db/mongo.service';
import {Statistic, TopPatient} from '../../../common/statistic.model';

@injectable()
export class StatisticsService {
    private patientDao: Model<PatientType>

    constructor(@inject(TYPES.MongoServiceProvider) private mongoService: MongoServiceProvider) {
        this.mongoService().then(m => m.patient().then(dao => this.patientDao = dao));
    }

    public computeStatistics(year: string | number, officeId?: string): Promise<Statistic> {
        year = Number(year)
        const statistic: Statistic = {
            ca: 0,
            caToDate: 0,
            consultations: 0,
            firstConsultations: 0,
            buckets: [],
            topPatients: [],
            range: year.toString()
        }

        for (let i = 1; i <= 12; i++) {
            statistic.buckets.push({
                ca: 0,
                consultations: 0,
                firstConsultations: 0,
                date: new Date(year+"-"+String(i).padStart(2, '0')+"-01T00:00:00.000Z")
            })
        }

        let filters: any = {}
        if (officeId) {
            filters["consultations.office"] = new Types.ObjectId(officeId)
        }

        const yearToDate = new Date()
        yearToDate.setFullYear(year)

        return this.patientDao.aggregate(
            [
                { "$match": { "consultations": {"$exists": true } } },
                { "$unwind": "$consultations"},
                { "$match": filters },
                {
                    "$project": {
                        "creationDateYear": { "$year": "$consultations.date" },
                        "creationDateMonth": { "$month": "$consultations.date" },
                        "price": "$consultations.price",
                        "firstConsultation": { "$eq": ["$consultations.id", 0]},
                        "caToDate": { "$cond": [ { "$lte": ["$consultations.date", yearToDate]}, "$consultations.price", 0] }
                    }
                },
                { "$match" : { "creationDateYear": Number(year) } },
                {
                    "$group": {
                        "_id": {
                            "$toDate": {
                                "$concat": [ { "$toString": "$creationDateYear" }, "-", { "$toString": "$creationDateMonth" }, "-01"]
                            }
                        },
                        "consultations": { "$sum": 1 },
                        "firstConsultations": { "$sum": {"$toInt":"$firstConsultation"} },
                        "ca": { "$sum": "$price" },
                        "caToDate": { "$sum": {"$toInt":"$caToDate"} },
                    }
                },
                { "$sort" : { "_id": 1} }
            ]
        ).exec()
            .then((bucket: []) => {
                bucket.forEach(b => {
                    const bucket = statistic.buckets.find(statBucket => {
                        const date =  b["_id"] as Date;

                        return date.getTime() == statBucket.date.getTime()
                    })
                    if (bucket) {
                        const bucketCa = b["ca"] as number
                        const bucketCaToDate = b["caToDate"] as number
                        const bucketConsultations = b["consultations"] as number
                        const bucketFirstConsultations = b["firstConsultations"] as number
                        bucket.ca = bucketCa
                        bucket.consultations = bucketConsultations
                        bucket.firstConsultations = bucketFirstConsultations

                        statistic.ca += bucketCa
                        statistic.caToDate += bucketCaToDate
                        statistic.consultations += bucketConsultations
                        statistic.firstConsultations += bucketFirstConsultations
                    }

                })

                return this.patientDao.aggregate([
                    { "$match": { "consultations": {"$exists": true } } },
                    {$unwind: "$consultations"},
                    { "$match": filters },
                    {
                        "$project": {
                            "creationDateYear": { "$year": "$consultations.date" },
                            "consultations": "$consultations",
                            "firstName": "$firstName",
                            "lastName": "$lastName",
                        }
                    },
                    { "$match" : { "creationDateYear": Number(year) } },
                    {
                        $group: {
                            _id: "$_id", "firstName": {$first: "$firstName"}, "lastName": {$first: "$lastName"}, size: {$sum: 1}
                        }
                    },
                    {$sort: {size: -1}},
                    {$limit: 3}
                ]).exec()
                    .then((patients: []) => {
                        statistic.topPatients.push(...patients.map(p => {
                            return {
                                firstName: p["firstName"],
                                lastName: p["lastName"],
                                email: p["email"],
                                consultations: p["size"]
                            } as TopPatient
                        }))
                        return statistic
                    });
            })
            .catch((e: Error) => {
                console.error('could not get patients, got error', e)
                throw e;
            });
    }
}