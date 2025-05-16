import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import * as userService from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required.');
    }
    const { user, token } = await authService.register(name, email, password, role);
    res.status(201).json({
      success: true,
      data: { 
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token 
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required.');
    }
    const { user, token } = await authService.login(email, password);
    res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ success: true, message: 'Logged out successfully. Please clear your token on the client-side.' });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required. User not identified.');
    }
    const user = await userService.findById(userId);
    res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIdParam = req.params.id;
    const userId = Number(userIdParam);

    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID format. ID must be a number.');
    }
    
    const user = await userService.findById(userId);
    res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};