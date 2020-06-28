import {Office} from './office.model';

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
    price: number;
    office: Office;
}