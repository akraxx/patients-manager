import {inject, injectable} from 'inversify';
import {TYPES} from '../constants/types';
import {MailerOptions} from './mailer.options';
import SMTPTransport, {MailOptions} from 'nodemailer/lib/smtp-transport';
import {createTransport, SentMessageInfo} from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import {logger} from '../logger/logger';

@injectable()
export class MailerService {

    private _mail: Mail

    constructor(@inject(TYPES.MailerOptions) private mailerOptions: MailerOptions) {
        logger.info(`creating mail transport using ${mailerOptions.host}:${mailerOptions.port} with user ${mailerOptions.auth.user}`)
        this._mail = createTransport(mailerOptions as SMTPTransport.Options)
    }

    public send(opts: MailOptions): Promise<SentMessageInfo> {
        return this._mail.sendMail(opts)
    }
}