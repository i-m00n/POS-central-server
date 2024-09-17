import { Request, Response, NextFunction } from "express";
import { CustomError, InternalServerError } from "../utils/CustomError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Determine if you are in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message,
      stack: isDevelopment ? err.stack : undefined, // Include stack trace in development only
    });
  } else {
    const internalError = new InternalServerError();
    res.status(internalError.statusCode).json({
      message: internalError.message,
      stack: isDevelopment ? err.stack : undefined, // Include stack trace in development only
    });
  }
};
