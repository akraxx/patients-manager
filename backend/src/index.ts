import 'reflect-metadata';

import {Server} from './core/server';
import {ServerOptions} from './core/server.options';

new Server({
    port: process.env.APP_PORT || 4000,
    production: process.env.PRODUCTION || true,
    keycloakHost: process.env.KEYCLOAK_HOST || 'http://localhost',

    mailerHost: process.env.MAIL_SERVER,
    mailerPort: Number(process.env.MAIL_PORT),
    mailerUser: process.env.MAIL_USER,
    mailerPassword: process.env.MAIL_PASSWORD,

    mongoHost: process.env.MONGO_HOST || 'localhost',
    mongoPort: process.env.MONGO_PORT || 27017,
    mongoDatabase: process.env.MONGO_DATABASE || 'patientsManager',
} as ServerOptions).start()
