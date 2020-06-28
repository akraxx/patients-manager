export class UserResponse {
    message: string;
    details?: any;

    constructor(message: string, details?: any) {
        this.message = message;
        this.details = details;
    }
}