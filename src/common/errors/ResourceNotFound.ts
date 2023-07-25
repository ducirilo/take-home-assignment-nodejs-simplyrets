import httpStatus from 'http-status';

export default class ResourceNotFoundError implements Error {
    public readonly name: string = 'ResourceNotFoundError';
    public readonly httpStatus: number = httpStatus.NOT_FOUND;

    constructor (private resource: string, private id: number) { }

    public get message(): string {
        return `The resource ${this.resource} with ID ${this.id} does not exist.`;
    }
}
