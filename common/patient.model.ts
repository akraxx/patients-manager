export class Antecedent {
    title: string;
    category?: string;
    important: boolean;
    value: string;
}

export class AntecedentCategory {
    title: string;
    antecedents: Antecedent[];
}

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

export enum PaymentType {
    None = 'Aucun',
    Check = 'Chèque',
    Cash = 'Liquide',
    Card = 'CB',
    Oops = 'Other',
}

export class Consultation {
    id: number;
    title: string = '';
    content: string;
    paymentType: string = 'None';
    clearedCheck: boolean = null;
    checkNumber: string;
    description: string = `
    <h1>Tests Medicaux</h1><p></p><h1>Tra&icirc;tement</h1><p></p><h1>Pour la prochaine s&eacute;ance</h1><p></p>
  `;
    date: Date = new Date();
    isOpen: boolean = false;
    osteopath: string;
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