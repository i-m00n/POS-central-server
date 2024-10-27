// src/controllers/OrderController.ts
import { Request, Response, NextFunction } from "express";
import { OrderRepository } from "../repositories/OrderRepository";
import { GetFilteredOrderDTO } from "../dtos/Order/GetFilteredOrderDTO";
import { CreateOrderDTO } from "../dtos/Order/CreateOrderDTO";
import { OrderResponseDTO } from "../dtos/Order/OrderResponseDTO";

export class OrderController {
  constructor() {
    this.getAllOrders = this.getAllOrders.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.getFilteredOrders = this.getFilteredOrders.bind(this);
  }

  async getAllOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders: OrderResponseDTO[] = await OrderRepository.getAllOrders();
      res.status(201).json({
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFilteredOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: GetFilteredOrderDTO = req.query;
      const orders: OrderResponseDTO[] = await OrderRepository.getFilteredOrders(dto);
      res.status(201).json({
        message: "Filtered orders fetched successfully",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderData: CreateOrderDTO = req.body;
      const order: OrderResponseDTO = await OrderRepository.createOrder(orderData);

      res.status(201).json({
        message: "Order created successfully",
        data: order,
        orderId: order.id,
      });
    } catch (error) {
      next(error);
    }
  }
}
