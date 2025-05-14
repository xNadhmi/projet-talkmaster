import { IUser, UserCreationAttributes } from '../types';
import * as userModel from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import bcrypt from 'bcrypt';

export const createUserService = async (userData: UserCreationAttributes): Promise<IUser> => {
   if (!userData.password) {
     throw new ApiError(400, 'Password is required for user creation.');
   }

   try {
      const newUser = await userModel.createUserInDB(userData);
      return newUser;
   } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || (error.message && error.message.toLowerCase().includes('duplicate entry'))) {
         throw new ApiError(409, 'This email is already in use.');
      }
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Create user service error:", error.message);
      throw new ApiError(500, 'An error occurred while creating the user.');
   }
};

export const findUserByIdService = async (id: string): Promise<IUser | null> => {
   try {
      const user = await userModel.findUserByIdFromDB(id);
      return user;
   } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Find user by ID service error:", error.message);
      throw new ApiError(500, 'An error occurred while fetching the user.');
   }
};

export const loginUserService = async (email: string, passwordInClear: string): Promise<IUser | null> => {
    try {
        const userWithPasswordHash = await userModel.findUserByEmailWithPasswordFromDB(email);

        if (!userWithPasswordHash) {
            return null;
        }

        const isMatch = await bcrypt.compare(passwordInClear, userWithPasswordHash.password_hash);

        if (!isMatch) {
            return null;
        }

        const { password_hash, ...userWithoutPassword } = userWithPasswordHash;
        return userWithoutPassword as IUser;

    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error("Login service error:", error.message);
        throw new ApiError(500, 'An error occurred during the login process.');
    }
};
