import 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        [key: string]: unknown;
      };
    }
  }
}
