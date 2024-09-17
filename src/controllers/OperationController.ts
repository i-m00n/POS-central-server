import { Request, Response, NextFunction } from "express";
import { OperationRepository } from "../repositories/OperationRepository";
import { OperationResponseDTO } from "../dtos/Operation/OperationResponseDTO";
import { CreateOperationDTO } from "../dtos/Operation/CreateOperationDTO";

export class OperationController {
  constructor() {
    this.getOperationsByOrderID = this.getOperationsByOrderID.bind(this);
    this.createOperation = this.createOperation.bind(this);
  }

  async getOperationsByOrderID(req: Request, res: Response, next: NextFunction) {
    try {
      const order_id = parseInt(req.params.order_id, 10);
      if (isNaN(order_id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const operations = await OperationRepository.getOperationsByOrderID(order_id);
      res.status(201).json({
        message: "operations by id fetched successfully",
        data: operations,
      });
    } catch (error) {
      next(error);
    }
  }

  async createOperation(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateOperationDTO = req.body;
      const operation = await OperationRepository.createOperation(dto);
      res.status(201).json({
        message: "operation created successfully",
        data: operation,
      });
    } catch (error) {
      next(error);
    }
  }
}
