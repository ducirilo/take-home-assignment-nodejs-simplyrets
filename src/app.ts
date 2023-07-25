import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import { propertyRoutes } from './routes';
import { RouteNotFoundError } from './common/errors';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());

// Gzip compression
app.use(compression());

// Enable cors
app.use(cors());
app.options('*', cors());

app.use('/properties', propertyRoutes);

// Send back a 404 error for any unknown api request
// eslint-disable-next-line
app.use((req: express.Request, res: express.Response) => {
    throw new RouteNotFoundError(req.originalUrl);
});

// error handler
// eslint-disable-next-line
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('🐞 Error:', err);

    res.status(err.httpStatus || httpStatus.INTERNAL_SERVER_ERROR).json({
        error: err.name || 'InternalError',
        reason: err.message || 'An unexpected error has occurred.',
        errors: err.errors || []
    });
});

export default app;
