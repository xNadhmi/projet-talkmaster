export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
  code?: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public errors?: ValidationErrorDetail[] | unknown[];

  constructor(statusCode: number, message: string, errors?: ValidationErrorDetail[] | unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
