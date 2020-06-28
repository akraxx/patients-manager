import {WebServiceError} from './WebServiceError';

export class NotFoundError extends WebServiceError {

    constructor(message: string, cause?: Error) {
        super(message, 404, cause);
    }

}