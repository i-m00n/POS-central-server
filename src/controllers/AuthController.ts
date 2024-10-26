import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { LoginDTO } from "../dtos/login/LoginDTO";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { IncorrectPasswordError, NotFoundError } from "../utils/CustomError";

export class AuthController {
  constructor() {
    this.login = this.login.bind(this);
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Create and validate DTO
      const loginData = new LoginDTO();
      loginData.username = req.body.username;
      loginData.password = req.body.password;

      // Find user and verify password
      const user = await UserRepository.findByUsername(loginData.username);
      const passwordMatch = await bcrypt.compare(loginData.password, user.password);

      if (!passwordMatch) {
        throw new IncorrectPasswordError();
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || "supersecretkey", {
        expiresIn: "1h",
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return res.json({
        token,
        user: userWithoutPassword,
        expiresIn: 3600, // 1 hour in seconds
      });
    } catch (error) {
      next(error);
    }
  }
}
