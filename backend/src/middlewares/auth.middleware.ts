import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

interface JwtPayload {
  id: number; 
  email: string;
  role: string;
  
  
}

const MODULE_LEVEL_JWT_SECRET = process.env.JWT_SECRET;

if (!MODULE_LEVEL_JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file. Authentication will fail.");
  
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const jwtSecretForVerification = MODULE_LEVEL_JWT_SECRET;

  if (!jwtSecretForVerification) {
    
    
    console.error("CRITICAL: JWT_SECRET is not available at runtime for authMiddleware.");
    return next(new ApiError(500, 'Internal Server Error: JWT secret configuration issue.'));
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token is required. Please include a Bearer token in the Authorization header.'));
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return next(new ApiError(401, 'Malformed token. Expected format: "Bearer <token>"'));
  }
  
  const scheme = parts[0]!;
  const token  = parts[1]!;

  if (scheme.toLowerCase() !== 'bearer' || !token) {
    return next(new ApiError(401, 'Malformed token. Scheme must be "Bearer" and token must be present.'));
  }

  try {
    const decoded = jwt.verify(token, jwtSecretForVerification) as JwtPayload;

    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next(); 
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token has expired. Please log in again.'));
    }
    if (err instanceof jwt.JsonWebTokenError) { 
      return next(new ApiError(401, `Invalid token: ${err.message}`));
    }
    
    console.error("Unexpected error during token verification:", err);
    return next(new ApiError(500, 'Internal server error while processing token.'));
  }
};

export const organizerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    
    
    console.error("CRITICAL: req.user not found in organizerMiddleware. Ensure authMiddleware runs first.");
    return next(new ApiError(401, 'Authentication required. User not identified.'));
  }

  if (req.user.role !== 'organisateur') { 
    return next(new ApiError(403, 'Forbidden: You do not have sufficient permissions. Organizer access required.'));
  }
  
  next(); 
};
