import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findByEmail, createUser } from '../repositories/user.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file for auth.service.");
}


export const register = async (name: string, email: string, password: string, role: string): Promise<{ user: User, token: string }> => {
  if (!JWT_SECRET) {
    throw new ApiError(500, 'JWT Secret not configured on server.');
  }

  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ name, email, password: hashedPassword, role });

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user: newUser, token };
};

export const login = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  if (!JWT_SECRET) {
    throw new ApiError(500, 'JWT Secret not configured on server.');
  }
  const user = await findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};
