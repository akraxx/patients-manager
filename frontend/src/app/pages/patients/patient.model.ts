import {Antecedent} from './patient-view/patient-antecedent/patient-antecedent.component';

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
  createdAt: Date;
}
