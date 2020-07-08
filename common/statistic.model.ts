import {User} from './user.model';

export class TopPatient extends User {
    consultations: number;
}

export class StatisticBucket {
    date: Date;
    ca: number;
    consultations: number;
    firstConsultations: number;
}

export class Statistic {
    ca: number;
    caToDate: number;
    consultations: number;
    firstConsultations: number;

    range: string;

    buckets: StatisticBucket[]

    topPatients: TopPatient[]
}