import { IUser, UserCreationAttributes } from '../types/index.js';
import * as userModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
