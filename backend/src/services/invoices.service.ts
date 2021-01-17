import {inject, injectable} from 'inversify';
import {TYPES} from '../constants/types';
import {Patient} from '../../../common/patient.model';
import {logger} from '../logger/logger';
import {ConsultationsService} from './consultations.service';
import {ReadStream} from 'fs';
import ejs from 'ejs';
import path from 'path';
import pdf, {FileInfo} from 'html-pdf';
import {PatientsService} from './patients.service';
import {VError} from 'verror'
import {MailerService} from '../mail/mailer.service';
import {SentMessageInfo} from 'nodemailer/lib/smtp-transport';
import {UserResponse} from '../../../common/user-response.model';
import {Consultation} from '../../../common/consultation.model';
import {OfficesService} from './offices.service';

const DATA_PATH = process.env.ASSETS_PATH || '/home/max/Documents/workspace/patients-manager/backend/data/';
const INVOICES_GENERATED_PATH = process.env.INVOICES_DIRECTORY || DATA_PATH + 'invoices/generated/';
const INVOICES_TEMPLATES_PATH = process.env.INVOICES_DIRECTORY || DATA_PATH + 'invoices/templates/';
const INVOICES_ASSETS_PATH = process.env.INVOICES_DIRECTORY || DATA_PATH + 'invoices/assets/';

@injectable()
export class InvoicesService {

    constructor(@inject(TYPES.ConsultationsService) private consultationsService: ConsultationsService,
                @inject(TYPES.PatientsService) private patientsService: PatientsService,
                @inject(TYPES.OfficesService) private officesService: OfficesService,
                @inject(TYPES.MailerService) private mailerService: MailerService) {

    }

    private static getEscapedOsteopathName(osteopathName: string): string {
        return osteopathName.replace('.', '-');
    }

    private static getPrettyOsteopathName(osteopathName: string): string {
        return osteopathName.split('.')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    private static buildMailOptions(patient: Patient, osteopathName: string, mailTemplate: string, fileInfo: FileInfo) {
        return {
            from: `"${osteopathName} - Ostéopathe" <factures@ingridlhotellier.fr>`,
            to: patient.mail,
            subject: 'Cabinet Ostéopathie - Eucalyptus - Facture',
            text: 'Vous trouverez ci-joint votre facture d\'ostéopathie.',
            html: mailTemplate,
            attachments: [{
                filename: path.basename(fileInfo.filename),
                path: fileInfo.filename,
                contentType: 'application/pdf',
            }],
        };
    }

    public async downloadInvoice(patientId: string, consultationId: number): Promise<ReadStream> {
        logger.info(`download invoice of consultation ${consultationId} of patient ${patientId}`);
        const patient = await this.patientsService.getPatientById(patientId);
        const consultation = await this.consultationsService.getConsultation(patientId, consultationId, patient);

        return this.renderPdfInvoice(patient, consultation)
            .then(data => {
                return new Promise((resolve, reject) => {
                    pdf.create(data, {
                        format: 'A3',
                        orientation: 'portrait',
                    }).toStream((err: Error, stream: ReadStream) => {
                        if (err) return reject(err)
                        resolve(stream)
                    })
                })
            });
    }

    public async sendInvoice(patientId: string, consultationId: number): Promise<UserResponse> {
        logger.info(`send invoice of consultation ${consultationId} to patient ${patientId}`);
        const patient = await this.patientsService.getPatientById(patientId);
        const consultation = await this.consultationsService.getConsultation(patientId, consultationId, patient);

        const filename = Consultation.invoiceFileName(consultation, patient);
        const absoluteFilePath = INVOICES_GENERATED_PATH + filename;

        const fileInfo: FileInfo = await this.renderPdfInvoice(patient, consultation)
            .then(data => {
                return new Promise((resolve, reject) => {
                    pdf.create(data, {
                        format: 'A3',
                        orientation: 'portrait',
                    }).toFile(absoluteFilePath, (err: Error, fileInfo: FileInfo) => {
                        if (err) return reject(err);
                        resolve(fileInfo);
                    })
                })
            });

        const mailTemplate = await this.renderMailInvoice(patient, consultation);

        logger.info(`sending mail with invoice of consultation ${consultation.id} to patient ${patient._id}...`);
        const mailOpts = InvoicesService.buildMailOptions(patient, InvoicesService.getPrettyOsteopathName(consultation.osteopath), mailTemplate, fileInfo);
        return this.mailerService.send(mailOpts)
            .then((s: SentMessageInfo) => new UserResponse('invoice has been sent by email', s))
            .catch(e => {
                throw new VError(e, 'could not send mail for consultation %d for patient %s %s',
                    consultation.id, patient.firstName, patient.lastName);
            });
    }

    private async renderPdfInvoice(patient: Patient, consultation: Consultation): Promise<string> {
        logger.info(`rendering pdf invoice of consultation ${consultation.id} for patient ${patient._id}`);
        return ejs.renderFile(path.join(INVOICES_TEMPLATES_PATH,
            InvoicesService.getEscapedOsteopathName(consultation.osteopath) + '.html.ejs'), {
            patient: patient,
            consultation: consultation,
            office: consultation.office,
            dateConsultation: consultation.date.toLocaleDateString('fr-FR'),
            dateBirthday: patient.birthDate.toLocaleDateString('fr-FR'),
            assetsPath: 'file://' + INVOICES_ASSETS_PATH,
        })
            .catch(e => {
                throw new VError(e, 'could not generate pdf invoice for consultation %d for patient %s %s',
                    consultation.id, patient.firstName, patient.lastName);
            });
    }

    private async renderMailInvoice(patient: Patient, consultation: Consultation): Promise<string> {
        logger.info(`rendering mail invoice of consultation ${consultation.id} for patient ${patient._id}`);
        return ejs.renderFile(path.join(INVOICES_TEMPLATES_PATH, InvoicesService.getEscapedOsteopathName(consultation.osteopath) + '-mail.html.ejs'), {
            patient: patient,
            consultation: consultation,
            dateConsultation: consultation.date.toLocaleDateString('fr-FR'),
        })
            .catch(e => {
                throw new VError(e, 'could not generate mail invoice for consultation %d for patient %s %s',
                    consultation.id, patient.firstName, patient.lastName);
            });
    }

}