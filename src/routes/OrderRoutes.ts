import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { OrderResponseDTO } from "../dtos/Order/OrderResponseDTO";
import { CreateOrderDTO } from "../dtos/Order/CreateOrderDTO";
import { GetFilteredOrderDTO } from "../dtos/Order/GetFilteredOrderDTO";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const orderController = new OrderController();

router.route("/order").post(authMiddleware, validationMiddleware(CreateOrderDTO), orderController.createOrder);

router.get("/order/all", authMiddleware, orderController.getAllOrders);
router.get(
  "/order/filter",
  authMiddleware,
  validationMiddleware(GetFilteredOrderDTO),
  orderController.getFilteredOrders
);

export default router;
