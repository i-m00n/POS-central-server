import { AppDataSource } from "../config/database.config";
import { CreateOrderDTO } from "../dtos/Order/CreateOrderDTO";
import { GetFilteredOrderDTO } from "../dtos/Order/GetFilteredOrderDTO";
import { OrderResponseDTO } from "../dtos/Order/OrderResponseDTO";
import { CentralOrder } from "../entities/OrderEntity";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { Between, FindOptionsWhere } from "typeorm";
import { NotFoundError } from "../utils/CustomError";
import { OperationRepository } from "./OperationRepository";
import { OperationResponseDTO } from "../dtos/Operation/OperationResponseDTO";

// Extend the repository to include custom methods
export const OrderRepository = AppDataSource.getRepository(CentralOrder).extend({
  async createOrder(orderData: CreateOrderDTO): Promise<OrderResponseDTO> {
    const customer = await CustomerRepository.findOne({
      where: { phone_number: orderData.customer_phone_number },
    });

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    const total_price = parseFloat(orderData.total_price);

    const order = this.create({
      total_price: total_price,
      order_type: orderData.order_type,
      order_method: orderData.order_method,
      date: new Date(orderData.date),
      customer: customer,
    });

    const savedOrder = await this.save(order);

    const orderResponseDTO: OrderResponseDTO = {
      total_price: savedOrder.total_price,
      order_type: savedOrder.order_type,
      order_method: savedOrder.order_method,
      date: savedOrder.date,
      customer_phone_number: savedOrder.customer.phone_number,
    };

    return orderResponseDTO;
  },

  async getAllOrders(): Promise<OrderResponseDTO[]> {
    const orders = await this.find({
      relations: ["customer"],
    });
    if (!orders.length) {
      throw new NotFoundError("No orders found");
    }

    const orderResponseDTOs: OrderResponseDTO[] = await Promise.all(
      orders.map(async (order) => {
        const operations: OperationResponseDTO[] = await OperationRepository.getOperationsByOrderID(order.id);
        if (!operations) {
          throw new NotFoundError("operations not found");
        }
        return {
          id: order.id,
          total_price: order.total_price,
          order_type: order.order_type,
          order_method: order.order_method,
          date: order.date,
          customer_phone_number: order.customer.phone_number,
          operations: operations,
        };
      })
    );

    return orderResponseDTOs;
  },

  async getFilteredOrders(dto: GetFilteredOrderDTO): Promise<OrderResponseDTO[]> {
    const where: FindOptionsWhere<CentralOrder> = {};

    if (dto.order_type) {
      where.order_type = dto.order_type;
    }

    if (dto.order_method) {
      where.order_method = dto.order_method;
    }

    if (dto.start_date && dto.end_date) {
      where.date = Between(dto.start_date, dto.end_date);
    }

    const orders = await this.find({
      where,
      relations: ["customer"],
    });

    if (!orders.length) {
      throw new NotFoundError("No orders matching the criteria found");
    }

    const orderResponseDTOs: OrderResponseDTO[] = orders.map((order) => ({
      id: order.id,
      total_price: order.total_price,
      order_type: order.order_type,
      order_method: order.order_method,
      date: order.date,
      customer_phone_number: order.customer.phone_number,
    }));

    return orderResponseDTOs;
  },
});
