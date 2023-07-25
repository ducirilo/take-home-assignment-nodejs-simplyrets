import { Repository } from 'typeorm';
import AppDataSource from '../dataSource';
import { Property } from '../entities';
import { ResourceNotFoundError }  from '../common/errors';
import { CreatePropertyData, ListPropertyFilter, ListPropertyResult, UpdatePropertyData } from '../interfaces';
import * as _ from 'lodash';

const DEFAULT_PAGE_SIZE = 50;

export class PropertyService {
    private readonly repository: Repository<Property>;

    constructor() {
        this.repository = AppDataSource.getRepository(Property);
    }

    async list(filters: ListPropertyFilter): Promise<ListPropertyResult> {
        const {
            page = 1,
            pageSize = DEFAULT_PAGE_SIZE,
            bedrooms,
            bathrooms,
            type
        } = filters;

        const take = pageSize;
        const skip = (pageSize * page) - pageSize;

        const [data, total] = await this.repository.findAndCount({
            where: {
                bedrooms,
                bathrooms,
                type
            },
            take,
            skip
        });

        return {
            data,
            total
        };
    }

    async findById(id: number): Promise<Property> {

        const result = await this.repository.findOneBy({ id });

        if (!result) {
            throw new ResourceNotFoundError('Property', id);
        }

        return result;
    }

    async create(data: CreatePropertyData): Promise<Property> {
        const {
            address,
            price,
            bedrooms,
            bathrooms,
            type
        } = data;

        const result = await this.repository.save({
            address,
            price,
            bedrooms,
            bathrooms,
            type
        });

        return result;
    }

    async update(id: number, data: UpdatePropertyData): Promise<Property> {
        const {
            address,
            price,
            bedrooms,
            bathrooms,
            type
        } = data;

        const property = await this.repository.findOne({
            where: { id }
        });

        if (!property) {
            throw new ResourceNotFoundError('Property', id);
        }

        const result = await this.repository.save({
            ..._.pick(property, ['id', 'address', 'price', 'bedrooms', 'bathrooms', 'type']), // existing fields
            ..._.pickBy({ // updated fields
                address,
                price,
                bedrooms,
                bathrooms,
                type
            }, _.identity)
        });

        return result;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete({ id });

        if (!result.affected) {
            throw new ResourceNotFoundError('Property', id);
        }

        return true;
    }
}
