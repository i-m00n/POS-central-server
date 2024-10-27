import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { authRequest } from "../types/authRequest";

export const authMiddleware = (req: authRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
  } catch (error) {
    next(error);
  }
};
