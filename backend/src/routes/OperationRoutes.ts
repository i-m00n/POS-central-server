import { Router } from "express";
import { OperationController } from "../controllers/OperationController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateOperationDTO } from "../dtos/Operation/CreateOperationDTO";
import { OperationResponseDTO } from "../dtos/Operation/OperationResponseDTO";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const operationController = new OperationController();

router
  .route("/operation")
  .post(authMiddleware, validationMiddleware(CreateOperationDTO), operationController.createOperation);

router
  .route("/operation/:order_id")
  .get(authMiddleware, validationMiddleware(OperationResponseDTO), operationController.getOperationsByOrderID);

export default router;
