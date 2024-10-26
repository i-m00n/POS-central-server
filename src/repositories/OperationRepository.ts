import { AppDataSource } from "../config/database.config";
import { CentralOperation } from "../entities/OperationEntity";
import { OperationResponseDTO } from "../dtos/Operation/OperationResponseDTO";
import { CreateOperationDTO } from "../dtos/Operation/CreateOperationDTO";
import { NotFoundError } from "../utils/CustomError";
import { OrderRepository } from "./OrderRepository";
import { ProductRepository } from "./ProductRepository";
export const OperationRepository = AppDataSource.getRepository(CentralOperation).extend({
  async getOperationsByOrderID(order_id: number): Promise<OperationResponseDTO[]> {
    const orderId = order_id;
    const operations = await this.find({
      where: { order: { id: orderId } },
      relations: ["order", "product"],
    });
    if (!operations) {
      throw new NotFoundError("No operations found for the given order ID");
    }

    const operationResponseDTOs: OperationResponseDTO[] = operations.map((operation) => ({
      quantity: operation.quantity,
      totalPrice: operation.total_price,
      order_id: operation.order.id,
      product_name: operation.product?.name ?? null,
      product_id: operation.product?.id ?? null,
    }));

    return operationResponseDTOs;
  },

  async createOperation(operationData: CreateOperationDTO): Promise<OperationResponseDTO> {
    const order = await OrderRepository.findOne({
      where: { id: operationData.order_id },
    });
    const product = await ProductRepository.findOne({
      where: { name: operationData.product_name },
    });

    if (!order) {
      throw new NotFoundError(`Order not found with id: ${operationData.order_id}`);
    }

    if (!product) {
      throw new NotFoundError(`Product not found with name: ${operationData.product_name}`);
    }

    const total_price = parseFloat(operationData.total_price);

    const operation = this.create({
      quantity: operationData.quantity,
      total_price: total_price,
      order: order,
      product: product,
    });

    const savedOperation = await this.save(operation);

    const operationResponseDTO: OperationResponseDTO = {
      quantity: savedOperation.quantity,
      total_price: savedOperation.total_price,
      order_id: savedOperation.order.id,
      product_id: savedOperation.product?.id ?? null,
    };

    return operationResponseDTO;
  },
});
