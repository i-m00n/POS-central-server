import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { LoginDTO } from "../dtos/login/LoginDTO";

const router = Router();
const authController = new AuthController();

router.post("/login", validationMiddleware(LoginDTO), authController.login);

export default router;
