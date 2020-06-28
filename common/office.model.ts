import {PaymentType} from './payment.model';
import {User} from './user.model';

export enum OfficeRole {
    Substitute = 'Remplaçant',
    Licensed = 'Titulaire',
    Admin = 'Administrateur',
}

export class OfficeMember {
    member: User;
    roles: OfficeRole[];

    constructor(member: User, ...roles: OfficeRole[]) {
        this.member = member;
        this.roles = roles;
    }
}

export class Office {
    _id: string;
    name: string;
    address: string;
    zipCode: number;
    city: string;
    price: number;
    paymentTypes: string[];
    members: OfficeMember[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}