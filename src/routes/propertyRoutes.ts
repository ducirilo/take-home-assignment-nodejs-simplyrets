import express from 'express';
import bodyParser from 'body-parser';
import { query, param, body } from 'express-validator';
import { PropertyService } from '../services';
import { DataInputValidatorMiddleware } from '../middlewares';
import httpStatus from 'http-status';

export const propertyRoutes = express.Router();

propertyRoutes.use(bodyParser.json());

const propertyService = new PropertyService();

propertyRoutes.get('/',
    [
        query('page').optional().isInt({ min: 1 }).withMessage('The filter page must be a positive integer'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('The filter pageSize must be a positive integer less than 100'),
        query('bedrooms').optional().isInt({ min: 0 }).withMessage('The bedrooms filter must be an integer greater than or equal zero'),
        query('bathrooms').optional().isInt({ min: 0 }).withMessage('The bathrooms filter must be an integer greater than or equal zero'),
        query('type').optional().isAlpha().notEmpty().withMessage('The type filter must be an string value')
    ],
    DataInputValidatorMiddleware,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve().then(async () => {
            const filters = req.query;
            const response = await propertyService.list(filters);
            return res.json(response);
        }).catch(next);
    }
);

propertyRoutes.get('/:id',
    [
        param('id').isInt({ min: 1 }).withMessage('The property ID must be a positive integer')
    ],
    DataInputValidatorMiddleware,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve().then(async () => {
            const id = parseInt(req.params.id, 10);
            const response = await propertyService.findById(id);
            return res.json(response);
        }).catch(next);
    }
);

propertyRoutes.post('/',
    [
        body('address').isString().notEmpty().withMessage('The address is required and must be a valid string'),
        body('price').isFloat({ min: 1 }).withMessage('The price is required and must be a positive numeric value'),
        body('bedrooms').isInt({ min: 0 }).withMessage('The bedrooms is required and must be an integer greater than or equal zero'),
        body('bathrooms').isInt({ min: 0 }).withMessage('The bathrooms is required and must be an integer greater than or equal zero'),
        body('type').optional().isAlpha().notEmpty().withMessage('The type filter must be an string value')
    ],
    DataInputValidatorMiddleware,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve().then(async () => {
            const data = req.body;
            const response = await propertyService.create(data);
            return res.json(response);
        }).catch(next);
    }
);

propertyRoutes.put('/:id',
    [
        param('id').isInt({ min: 1 }).withMessage('The property ID must be a positive integer'),
        body('address').optional().isString().notEmpty().withMessage('The address and must be a valid string'),
        body('price').optional().isFloat({ min: 1 }).withMessage('The price must be a positive numeric value'),
        body('bedrooms').optional().isInt({ min: 0 }).withMessage('The bedrooms must be an integer greater than or equal zero'),
        body('bathrooms').optional().isInt({ min: 0 }).withMessage('The bathrooms must be an integer greater than or equal zero'),
        body('type').optional().isAlpha().notEmpty().withMessage('The type filter must be an string value')
    ],
    DataInputValidatorMiddleware,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve().then(async () => {
            const id = parseInt(req.params.id, 10);
            const data = req.body;
            const response = await propertyService.update(id, data);
            return res.json(response);
        }).catch(next);
    }
);

propertyRoutes.delete('/:id',
    [
        param('id').isInt({ min: 1 }).withMessage('The property ID must be a positive integer')
    ],
    DataInputValidatorMiddleware,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve().then(async () => {
            const id = parseInt(req.params.id, 10);
            await propertyService.delete(id);
            return res.status(httpStatus.NO_CONTENT).send();
        }).catch(next);
    }
);
