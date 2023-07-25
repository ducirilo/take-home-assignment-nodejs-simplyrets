import httpStatus from 'http-status';

export default class DataInputValidationError implements Error {
    public readonly name: string = 'DataInputValidationError';
    public readonly httpStatus: number = httpStatus.BAD_REQUEST;

    constructor (private errors: any[]) { }

    public get message(): string {
        return 'Your request could not be processed. Please fix the errors and try again';
    }

    public get erros(): any[] {
        return this.errors;
    }
}
