import {Antecedent} from "./patient-view/patient-antecedent/patient-antecedent.component";

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
  id: number;
  firstName: string;
  lastName: string;
  birthdate: Date;
  mobilePhone: string;
  phone: string;
  mail: string;
  address: string;
  zipCode: number;
  city: string;
  deceased: boolean;
  sexe: Sexe;
  maritalStatus: MaritalStatus;
  children: number;
  profession: string;
  hobbies: string;
  doctor: string;
  complementaryHealth: string;
  socialSecurityNumber: string;
  sentBy: string;
  handOrientation: HandOrientation;
  remarks: string;
  antecedents: Antecedent[];
}
