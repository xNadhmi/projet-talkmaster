import { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationErrorDetail } from '../utils/ApiError.js'; 
import logger from '../utils/logger.js'; 

interface StandardErrorResponse {
    success: false; 
    error: {
        message: string;
        statusCode: number;
        code?: string; 
        details?: ValidationErrorDetail[] | unknown[]; 
        timestamp: string; 
        path: string; 
    };
}

export const globalErrorHandler = (
    err: Error | ApiError | unknown, 
    req: Request,
    res: Response,
    _next: NextFunction 
): void => {
    let statusCode: number;
    let message: string;
    let errorCode: string | undefined;
    let errorDetails: ValidationErrorDetail[] | unknown[] | undefined;

    const timestamp = new Date().toISOString();
    const path = req.originalUrl;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errors;
        

        logger.warn(`API Error: ${statusCode} - ${message} on path ${path}`, {
            details: errorDetails,
            
        });
    } else if (err instanceof Error) {
        
        statusCode = 500; 
        message = 'An unexpected internal server error occurred. Please try again later.';
        
        logger.error(`Unhandled Server Error: ${err.message} on path ${path}`, {
            stack: err.stack,
            errorName: err.name,
        });

        
        
        
        if (process.env.NODE_ENV === 'development') {
            message = `Dev Info: ${err.message}`; 
            
        }
    } else {
        
        statusCode = 500;
        message = 'An unknown and unexpected error occurred.';
        logger.error(`Unknown error type caught in global error handler on path ${path}`, {
            errorObject: err, 
        });
    }

    const errorResponse: StandardErrorResponse = {
        success: false,
        error: {
            message,
            statusCode,
            code: errorCode,
            details: errorDetails,
            timestamp,
            path,
        },
    };

    
    if (res.headersSent) {
        logger.error("Headers already sent, cannot send error response to client.", { path, originalError: err });
        return; 
    }

    res.status(statusCode).json(errorResponse);
};
