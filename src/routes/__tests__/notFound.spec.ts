import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import httpStatus from 'http-status';

describe('notFound', () => {

    beforeAll(async () => {
        await AppDataSource.initialize();
        await seedDb();
    });

    describe('GET /unknow', () => {

        it('should fail with not found error', async () => {
            const response = await request(app)
                .get('/unknown');

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    });


    describe('POST /unknow', () => {

        it('should fail with not found error', async () => {
            const response = await request(app)
                .post('/unknown');

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    });

    describe('PUT /unknow', () => {

        it('should fail with not found error', async () => {
            const response = await request(app)
                .put('/unknown');

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    });

    describe('DELETE /unknow', () => {

        it('should fail with not found error', async () => {
            const response = await request(app)
                .del('/unknown');

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    });

});
