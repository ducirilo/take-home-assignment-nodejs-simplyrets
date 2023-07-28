import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import { Property } from '../../entities';
import httpStatus from 'http-status';

describe('propertyRoutes', () => {

    beforeAll(async () => {
        await AppDataSource.initialize();
        await seedDb();
    });

    describe('GET /properties', () => {
        it('should return the properties limited to the default page size', async () => {

            const response = await request(app)
                .get('/properties');
      
            expect(response.status).toBe(httpStatus.OK);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(50);
            expect(response.body.total).toBeGreaterThanOrEqual(50);
        });

        it('should return the properties with pagination', async () => {

            const response = await request(app)
                .get('/properties')
                .query({
                    page: 1,
                    pageSize: 77
                });
      
            expect(response.status).toBe(httpStatus.OK);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(77);
            expect(response.body.total).toBeGreaterThanOrEqual(77);
        });

        it('should return the properties filtered properly', async () => {

            const response = await request(app)
                .get('/properties')
                .query({
                    type: 'SingleFamilyResidence',
                    bedrooms: 5,
                    bathrooms: 4
                });

            expect(response.status).toBe(httpStatus.OK);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.total).toBeGreaterThanOrEqual(1);
            expect(response.body.data.every((property: Property) => {
                return property.type === 'SingleFamilyResidence'
                  && property.bedrooms === 5
                  && property.bathrooms === 4;
            })).toBe(true);
        });

        it('should return the properties filtered by price properly', async () => {

            const response = await request(app)
                .get('/properties')
                .query({
                    minPrice: 100000,
                    maxPrice: 20000000
                });

            expect(response.status).toBe(httpStatus.OK);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.total).toBeGreaterThanOrEqual(1);
            expect(response.body.data.every((property: Property) => {
                return property.price >= 100000
                  && property.price <= 20000000;
            })).toBe(true);
        });

        it('should fail with a conflict error if max price filter is less than min price filter', async () => {

            const response = await request(app)
                .get('/properties')
                .query({
                    minPrice: 20000000,
                    maxPrice: 100000
                });

            expect(response.status).toBe(httpStatus.CONFLICT);
        });

        it('should fail with a bad request error if parameters are incorrect', async () => {
            const response = await request(app)
                .get('/properties')
                .query({
                    page: 'x',
                    pageSize: 15,
                    type: 1,
                    bedrooms: 'a',
                    bathrooms: true
                });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.find((err: any) => err.path === 'page')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'type')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'bedrooms')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'bathrooms')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'pageSize')).toBeUndefined(); // the only one correct
        });
    });

    describe('GET /properties/:id', () => {
        it('should find a property', async () => {

            const response = await request(app)
                .get('/properties/13');

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.id).toBe(13);
        });

        it('should fail with a not found error if ID does not exist', async () => {

            const response = await request(app)
                .get('/properties/9999999');

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should fail with a bad request error if ID is malformed', async () => {

            const response = await request(app)
                .get('/properties/abc');

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.find((err: any) => err.path === 'id')).not.toBeUndefined();
        });
    });

    describe('POST /properties', () => {
        it('should create a new property with all parameters provided', async () => {

            const response = await request(app)
                .post('/properties')
                .send({
                    address: 'Amazing Street, 79, Heaven Park',
                    price: 12345,
                    bedrooms: 3,
                    bathrooms: 2,
                    type: 'House'
                });

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.id).not.toBeUndefined();
            expect(response.body).toMatchObject({
                address: 'Amazing Street, 79, Heaven Park',
                price: 12345,
                bedrooms: 3,
                bathrooms: 2,
                type: 'House'
            });
        });

        it('should create a new property without optional parameters', async () => {

            const response = await request(app)
                .post('/properties')
                .send({
                    address: 'New Brazilia, 1988, South America Bv',
                    price: 8769,
                    bedrooms: 2,
                    bathrooms: 1
                    // type is supressed
                });

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.id).not.toBeUndefined();
            expect(response.body).toMatchObject({
                address: 'New Brazilia, 1988, South America Bv',
                price: 8769,
                bedrooms: 2,
                bathrooms: 1
            });
        });

        it('should fail with a bad request error if parameters are incorrect', async () => {
            const response = await request(app)
                .post('/properties')
                .send({
                    address: false,
                    price: 'abc',
                    bedrooms: 'x',
                    bathrooms: 2,
                    type: 44
                });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.find((err: any) => err.path === 'address')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'price')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'bedrooms')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'type')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'bathrooms')).toBeUndefined(); // the only one correct
        });
    });

    describe('PUT /properties/:id', () => {
        it('should update a property', async () => {

            const response = await request(app)
                .put('/properties/1')
                .send({
                    address: 'ABC Park',
                    price: 123,
                    bedrooms: 77,
                    bathrooms: 88,
                    type: 'Hotel'
                });

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.id).not.toBeUndefined();
            expect(response.body).toMatchObject({
                address: 'ABC Park',
                price: 123,
                bedrooms: 77,
                bathrooms: 88,
                type: 'Hotel'
            });
        });

        it('should fail with a not found error if ID does not exist', async () => {

            const response = await request(app)
                .put('/properties/888888')
                .send({
                    address: 'ABC Park',
                    price: 123,
                    bedrooms: 77,
                    bathrooms: 88,
                    type: 'Hotel'
                });

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should fail with a bad request error if parameters are incorrect', async () => {

            const response = await request(app)
                .put('/properties/1')
                .send({
                    address: 1657,
                    price: 'abc',
                    bedrooms: 9,
                    bathrooms: true,
                    type: null
                });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.find((err: any) => err.path === 'address')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'price')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'bathrooms')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'type')).not.toBeUndefined();
            expect(response.body.errors.find((err: any) => err.path === 'bedrooms')).toBeUndefined(); // the only one correct
        });
    });

    describe('DELETE /properties/:id', () => {
        it('should delete a property', async () => {

            const response = await request(app)
                .del('/properties/100');

            expect(response.status).toBe(httpStatus.NO_CONTENT);
        });

        it('should fail with a not found error if ID does not exist', async () => {

            const response = await request(app)
                .del('/properties/888888');

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    });

});
