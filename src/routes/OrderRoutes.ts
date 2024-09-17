import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { OrderResponseDTO } from "../dtos/Order/OrderResponseDTO";
import { CreateOrderDTO } from "../dtos/Order/CreateOrderDTO";
import { GetFilteredOrderDTO } from "../dtos/Order/GetFilteredOrderDTO";

const router = Router();
const orderController = new OrderController();

router
  .route("/order")
  .get(validationMiddleware(OrderResponseDTO), orderController.getAllOrders)
  .post(validationMiddleware(CreateOrderDTO), orderController.createOrder);

router.get("/order/filter", validationMiddleware(GetFilteredOrderDTO), orderController.getFilteredOrders);

export default router;
