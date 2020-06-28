import {Principal} from './auth/principal';


declare global {
    namespace Express {
        interface Request {
            user?: Principal;
        }
    }
}