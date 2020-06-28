import {inject, injectable} from 'inversify';
import {interfaces} from 'inversify-express-utils';
import * as express from 'express';
import {logger} from '../logger/logger';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import {TYPES} from '../constants/types';
import {AuthOptions} from './auth.options';
import {Principal} from './principal';

const authOptions = inject(TYPES.AuthOptions);

@injectable()
export class JWTAuthProvider implements interfaces.AuthProvider {

    @authOptions private readonly _authOptions: AuthOptions;

    constructor() {
    }

    public async getUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<interfaces.Principal> {
        logger.debug(`extract jwt and validate it with options ${JSON.stringify(this._authOptions)}`)

        if (this._authOptions.enabled) {
            return new Promise((resolve) => jwt({
                // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
                secret: jwksRsa.expressJwtSecret({
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: `${this._authOptions.keycloakHost}/auth/realms/patients-manager/protocol/openid-connect/certs`
                }),

                // Validate the audience and the issuer.
                audience: 'frontend',
                issuer: `${this._authOptions.keycloakHost}/auth/realms/patients-manager`,
                algorithms: ['RS256']
            })
                .unless({path: ['/version']})
                .call(this, req, res, function (err: any) {
                    if (err) {
                        next(err)
                    } else {
                        logger.debug(`logged user details : ${JSON.stringify(req.user)}`)
                        resolve(req.user);
                    }
                }))
        } else {
            logger.warn(`auth has been disabled, it should never be used in production`)
            return {
                userName: 'ingrid.lhotellier',
                firstName: 'Ingrid',
                lastName: 'Lhotellier',
                email: 'contact@ingridlhotellier.fr'
            } as Principal
        }
    }

}