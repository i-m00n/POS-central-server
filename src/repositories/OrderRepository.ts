import { AppDataSource } from "../config/database.config";
import { CreateOrderDTO } from "../dtos/Order/CreateOrderDTO";
import { GetFilteredOrderDTO } from "../dtos/Order/GetFilteredOrderDTO";
import { OrderResponseDTO } from "../dtos/Order/OrderResponseDTO";
import { CentralOrder } from "../entities/OrderEntity";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { Between, FindOptionsWhere } from "typeorm";
import { NotFoundError } from "../utils/CustomError";

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
      branch_name: orderData.branch_name,
      order_type: orderData.order_type,
      order_method: orderData.order_method,
      date: new Date(orderData.date),
      customer: customer,
    });

    const savedOrder = await this.save(order);

    const orderResponseDTO: OrderResponseDTO = {
      id: savedOrder.id,
      total_price: savedOrder.total_price,
      branch_name: savedOrder.branch_name,
      order_type: savedOrder.order_type,
      order_method: savedOrder.order_method,
      date: savedOrder.date,
      customer_phone_number: savedOrder.customer.phone_number,
    };

    return orderResponseDTO;
  },

  async getAllOrders(): Promise<OrderResponseDTO[]> {
    // Fetch orders along with customer and operations relations
    const orders = await this.find({
      relations: ["customer", "operations", "operations.product"], // Load both operations and associated products
    });

    // If no orders found, throw an error
    if (!orders.length) {
      throw new NotFoundError("No orders found");
    }

    // Map orders to OrderResponseDTO including operations
    const orderResponseDTOs: OrderResponseDTO[] = orders.map((order) => ({
      id: order.id,
      total_price: order.total_price,
      order_type: order.order_type,
      order_method: order.order_method,
      date: order.date,
      customer_phone_number: order.customer.phone_number,
      operations: order.operations.map((operation) => ({
        quantity: operation.quantity,
        total_price: operation.total_price,
        product_name: operation.product?.name,
      })),
    }));

    return orderResponseDTOs;
  },
  async getFilteredOrders(dto: GetFilteredOrderDTO): Promise<OrderResponseDTO[]> {
    const where: FindOptionsWhere<CentralOrder> = {};

    // Add filtering criteria dynamically
    if (dto.order_type) {
      where.order_type = dto.order_type;
    }

    if (dto.order_method) {
      where.order_method = dto.order_method;
    }

    if (dto.start_date && dto.end_date) {
      const endDateInclusive = new Date(dto.end_date);
      endDateInclusive.setHours(23, 59, 59, 999);

      where.date = Between(dto.start_date, endDateInclusive);
    }

    // Fetch filtered orders along with customer and operations relations
    const orders = await this.find({
      where,
      relations: ["customer", "operations", "operations.product"], // Load operations and their associated product
    });

    if (!orders.length) {
      throw new NotFoundError("No orders matching the criteria found");
    }

    // Map orders to OrderResponseDTO including operations
    const orderResponseDTOs: OrderResponseDTO[] = orders.map((order) => ({
      id: order.id,
      total_price: order.total_price,
      order_type: order.order_type,
      order_method: order.order_method,
      date: order.date,
      customer_phone_number: order.customer.phone_number,
      operations: order.operations.map((operation) => ({
        quantity: operation.quantity,
        total_price: operation.total_price,
        product_name: operation.product?.name,
      })),
    }));

    return orderResponseDTOs;
  },
});
