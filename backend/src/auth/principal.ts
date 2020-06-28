import {interfaces} from 'inversify-express-utils';
import {User} from '../../../common/user.model';

export class Principal extends User implements interfaces.Principal {

    isAuthenticated(): Promise<boolean> {
        return Promise.resolve(false);
    }

    isInRole(role: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(true);
    }

    details: any;
}