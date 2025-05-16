import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { ApiError } from './utils/ApiError.js';
import mainApiRouter from './routes/index.js'; 

dotenv.config();

const app: Express = express();

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    optionsSuccessStatus: 200,
    credentials: true, 
};
app.use(cors(corsOptions));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.redirect('/api/health'); 
});

app.use('/api', mainApiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, `The requested resource '${req.originalUrl}' was not found on this server.`));
});

app.use(globalErrorHandler);

export default app;
