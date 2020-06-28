export interface ServerOptions {
    port: number;
    production: boolean;
    keycloakHost: string;

    mailerHost: string;
    mailerPort: number;
    mailerUser: string;
    mailerPassword: string;

    mongoHost: string;
    mongoPort: number;
    mongoDatabase: string;
}