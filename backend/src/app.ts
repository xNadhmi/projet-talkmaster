import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mainApiRouter from './routes';
import logger from './utils/logger';
import { ErrorResponse } from './types';

dotenv.config();

const app: Express = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
});


app.get('/', (req: Request, res: Response) => {
  res.redirect('/api');
});
app.use('/api', mainApiRouter);
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', message: 'API is healthy' });
});
app.use('/api/users', mainApiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error: ErrorResponse = {
        message: 'Ressource non trouvée.',
        statusCode: 404,
    };
    res.status(404).json(error);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erreur interne du serveur.';
    const response: ErrorResponse = { message };
    if (process.env.NODE_ENV === 'development' && err.stack) {
        // response.stack = err.stack;
    }
    res.status(statusCode).json(response);
});

export default app;
