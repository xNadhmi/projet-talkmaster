export interface IUser extends Document {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes {
  name: string;
  email: string;
  password?: string;
}

export interface ErrorResponse {
  message: string;
  statusCode?: number;
  errors?: any[];
}