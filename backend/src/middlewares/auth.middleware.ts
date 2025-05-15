import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { ApiError } from "../utils/ApiError";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new ApiError(401, "Token manquant ou invalide."));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!JWT_SECRET) {
      throw new ApiError(500, "JWT_SECRET n'est pas défini.");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      id: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("Authentication error:", err);
    next(new ApiError(403, "Token invalide."));
  }
};
