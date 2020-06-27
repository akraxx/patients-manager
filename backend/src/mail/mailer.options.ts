import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface MailerOptions extends SMTPTransport.Options {

}