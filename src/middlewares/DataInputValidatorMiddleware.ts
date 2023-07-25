import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { DataInputValidationError } from '../common/errors';

export function DataInputValidatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return next(new DataInputValidationError(validationErrors.array()));
    }

    return next();
}