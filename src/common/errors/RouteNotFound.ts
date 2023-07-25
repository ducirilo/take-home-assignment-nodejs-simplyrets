import httpStatus from 'http-status';

export default class RouteNotFoundError implements Error {
    public readonly name: string = 'RouteNotFoundError';
    public readonly httpStatus: number = httpStatus.NOT_FOUND;

    constructor (private route: string) { }

    public get message(): string {
        return `The route ${this.route} does not exist.`;
    }
}
