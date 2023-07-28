import httpStatus from 'http-status';

export default class ApplicationError implements Error {
    public readonly name: string = 'ApplicationError';
    public readonly httpStatus: number = httpStatus.CONFLICT;

    constructor (private errorMessage: string) { }

    public get message(): string {
        return `Could not process your request: ${this.errorMessage}`;
    }
}
