import {Container} from 'inversify';
import {PatientsService} from '../services/patients.service';
import {TYPES} from '../constants/types';
import {ConsultationsService} from '../services/consultations.service';
import {InversifyExpressServer} from 'inversify-express-utils';
import expressWinston from 'express-winston';
import winston from 'winston';
import {Application, NextFunction, Request, Response} from 'express';
import {WebServiceError} from '../error/WebServiceError';
import {customFormat, logger} from '../logger/logger';
import bodyParser from 'body-parser';
import i18n from 'i18n'
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import {ServerOptions} from './server.options';

import '../controllers/version.controller';
import '../controllers/patients.controller';
import '../controllers/consulations.controller';
import '../controllers/offices.controller';
import '../controllers/statistics.controller';
import '../error/WebServiceError'
import {InvoicesService} from '../services/invoices.service';
import {MailerOptions} from '../mail/mailer.options';
import {MailerService} from '../mail/mailer.service';
import {MongoService, MongoServiceProvider} from '../db/mongo.service';
import {MongoOptions} from '../db/mongo.options';
import {JWTAuthProvider} from '../auth/auth.provider';
import {AuthOptions} from '../auth/auth.options';
import {OfficesService} from '../services/offices.service';
import {StatisticsService} from '../services/statistics.service';

export class Server {

    constructor(private opts: ServerOptions) {
    }

    private initContainer(): Container {
        // set up container
        logger.info(`setting up container and bindings...`);

        let container = new Container({ defaultScope: "Singleton" });

        container.bind<MailerOptions>(TYPES.MailerOptions).toConstantValue({
            host: this.opts.mailerHost,
            port: this.opts.mailerPort,
            secure: true,
            requireTLS: true,
            auth: {
                user: this.opts.mailerUser,
                pass: this.opts.mailerPassword
            }
        });
        container.bind<MongoOptions>(TYPES.MongoOptions).toConstantValue({
            host: this.opts.mongoHost,
            port: this.opts.mongoPort,
            db: this.opts.mongoDatabase,
        });

        container.bind<AuthOptions>(TYPES.AuthOptions).toConstantValue({
            keycloakHost: this.opts.keycloakHost,
            enabled: this.opts.production
        });

        container.bind<MailerService>(TYPES.MailerService).to(MailerService);
        container.bind<MongoService>(TYPES.MongoService).to(MongoService);

        container.bind<MongoServiceProvider>(TYPES.MongoServiceProvider).toProvider<MongoService>(context => {
                return () => {
                    {
                        return new Promise<MongoService>((resolve => {
                            let mongoService = context.container.get<MongoService>(TYPES.MongoService);
                            resolve(mongoService);
                        }))
                    }
                }
            }
        );

        container.bind<PatientsService>(TYPES.PatientsService).to(PatientsService);
        container.bind<ConsultationsService>(TYPES.ConsultationsService).to(ConsultationsService);
        container.bind<InvoicesService>(TYPES.InvoicesService).to(InvoicesService);
        container.bind<OfficesService>(TYPES.OfficesService).to(OfficesService);
        container.bind<StatisticsService>(TYPES.StatisticsService).to(StatisticsService);

        return container
    }

    private static initLanguage() {
        i18n.configure({
            locales: ['fr']
        });
    }

    public start(): void {
        logger.info(`starting server...`);
        Server.initLanguage()
        const container = this.initContainer()

        new InversifyExpressServer(container, null, null, null, JWTAuthProvider)
            .setConfig((app: Application) => {
                // language
                app.use(i18n.init);

                // add body parser
                app.use(bodyParser.urlencoded({extended: true}));
                app.use(bodyParser.json());

                // logging
                app.use(
                    expressWinston.logger({
                        transports: [
                            new winston.transports.Console()
                        ],
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.colorize(),
                            winston.format.simple(),
                            customFormat
                        ),
                        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
                        msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms {{req.ip}} {{req.hostname}}',
                        expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
                        colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
                        ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
                    })
                )
            }).setErrorConfig((app: Application) => {
            app.use((req: Request, res: Response) => {
                res.status(404).json({message: "Not found"})
            });
            app.use((err: WebServiceError, req: Request, res: Response, next: any) => {

                logger.error(`${err.name}(${err.status || 500}): ${err.message} - ${err.stack}`);
                if (err.name === 'ValidationError') {
                    res.status(422).json(err);
                } else {
                    // render the error page
                    res.status(err.status || 500).send({
                        message: err.message,
                        name: err.name,
                        stack: err.stack,
                        status: err.status
                    });
                    //res.send(err.status);
                }
            });
        })
            .build()
            .listen(this.opts.port, () => logger.info(`app is listening on port ${this.opts.port}`));

    }
}