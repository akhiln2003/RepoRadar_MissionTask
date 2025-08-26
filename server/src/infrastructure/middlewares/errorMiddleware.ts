import { Request, Response, NextFunction } from "express";
import { AppError } from "../../infrastructure/errors/AppError";

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
}
