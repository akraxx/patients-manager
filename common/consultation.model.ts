import {Office} from './office.model';
import {Patient} from './patient.model';

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
    hidden: boolean = false;
    price: number;
    office: Office;

    public static invoiceFileName(consultation: Consultation, patient: Patient) {
        const filename = patient.lastName.toUpperCase()
            + '_' + patient.firstName.toLowerCase()
            + '_' + consultation.date.toLocaleDateString('fr-FR').split('/').join('-')
            + '.pdf';
        return filename.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
    }
}