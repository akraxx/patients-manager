import {Consultation} from './consultation.model';
import {Antecedent} from './antecedent.model';

export enum Sexe {
    F = 'Femme',
    M = 'Homme',
}

export enum MaritalStatus {
    NA = 'Non précisé',
    Maried = 'Marié(e)',
    Single = 'Célibataire',
    InRelationship = 'En couple',
    CivilUnion = 'Pacsé(e)',
    Divorced = 'Divorsé(e)',
    Widower = 'Veuf(ve)',
}

export enum HandOrientation {
    Right = 'Droitier',
    Left = 'Gaucher',
}

export class PatientResultSet {
    total: number;
    patients: Patient[];


    constructor(total: number, patients: Patient[]) {
        this.total = total;
        this.patients = patients;
    }
}

export class Patient {
    _id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    mobilePhone: string;
    phone: string;
    mail: string;
    address: string;
    zipCode: number;
    city: string;
    deceased: boolean;
    sexe: string = 'M';
    maritalStatus: string = 'NA';
    children: number;
    job: string;
    hobbies: string;
    doctor: string;
    complementaryHealth: string;
    socialSecurityNumber: string;
    sentBy: string;
    handOrientation: string = 'Right';
    remarks: string;
    antecedents: Antecedent[];
    consultations: Consultation[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}