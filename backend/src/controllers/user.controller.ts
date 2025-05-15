import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { UserCreationAttributes } from "../types";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { ApiError } from "../utils/ApiError";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = req.body as UserCreationAttributes;

    if (!userData.name || !userData.email || !userData.password) {
      res
        .status(400)
        .json({ message: "Name, email, and password are required." });
      return;
    }

    const newUser = await userService.createUserService(userData);
    res.status(201).json(newUser);
  } catch (error: any) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID is required in path." });
      return;
    }

    const user = await userService.findUserByIdService(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await userService.loginUserService(email, password);

    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    if (!JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined.");
      throw new ApiError(500, "Internal server configuration error.");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password } = req.body;
    const user = (req as any).user;

    if (!user?.id) {
      res.status(401).json({ message: "Unauthenticated user." });
      return;
    }

    if (!password || password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
      return;
    }

    await userService.updateUserPasswordService(user.id, password);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};
