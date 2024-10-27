import { Request, Response, NextFunction } from "express";
import { CustomerResponseDTO } from "../dtos/Customer/CustomerResponseDTO";
import { CreateCustomerDTO } from "../dtos/Customer/CreateCustomerDTO";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { GetFilteredCustomersDTO } from "../dtos/Customer/GetFilteredCustomersDTO";
import { NotFoundError } from "../utils/CustomError";
import { UpdateCustomerDataDTO } from "../dtos/Customer/UpdateCustomerDataDTO";
import { RabbitMQPublisher } from "../message_brokers/rabbitmq.publisher";
import { UnsentMessageRepository } from "../repositories/UnsentMessageRepository";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";
import { AppDataSource } from "../config/database.config";
export class CustomerController {
  constructor() {
    this.createCustomer = this.createCustomer.bind(this);
    this.getFilteredCustomers = this.getFilteredCustomers.bind(this);
    this.getAllCustomers = this.getAllCustomers.bind(this);
    this.updateCustomerData = this.updateCustomerData.bind(this);
    this.deleteCustomerByName = this.deleteCustomerByName.bind(this);
    this.deleteAllCustomers = this.deleteAllCustomers.bind(this);
  }

  // 1. Create a new customer
  async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const customerData: CreateCustomerDTO = req.body;
        const customer: CustomerResponseDTO = await CustomerRepository.createCustomer(customerData);

        const rabbitMQ_message = {
          table: "customer",
          action: "create",
          data: customerData,
        };
        await UnsentMessageRepository.saveMessage(
          rabbitMQ_message,
          RABBITMQ_CONFIG.exchange.broadcast,
          transactionalEntityManager
        );
        return customer;
      });
      res.status(201).json({
        message: "Customer created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. Get filtered customers
  async getFilteredCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: GetFilteredCustomersDTO = req.query;
      const customers: CustomerResponseDTO[] = await CustomerRepository.getFilteredCustomers(dto);
      res.status(200).json({
        message: "Filtered customers fetched successfully",
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  }

  // 3. Get all customers
  async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const customers: CustomerResponseDTO[] = await CustomerRepository.getAllCustomers();
      res.status(200).json({
        message: "Customers fetched successfully",
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  }

  // 4. Update customer total paid
  async updateCustomerData(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const dto: UpdateCustomerDataDTO = req.body;
        const customer: CustomerResponseDTO = await CustomerRepository.updateCustomerData(dto);

        const rabbitMQ_message = {
          table: "customer",
          action: "updateTotalPaid",
          data: dto,
        };
        await UnsentMessageRepository.saveMessage(
          rabbitMQ_message,
          RABBITMQ_CONFIG.exchange.broadcast,
          transactionalEntityManager
        );
        return customer;
      });
      res.status(200).json({
        message: "Customer total paid updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 5. Delete a customer
  async deleteCustomerByName(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const name = req.query.name as string;

        if (!name) {
          throw new NotFoundError("Customer name is required");
        }

        const deletedCustomer = await CustomerRepository.deleteCustomerByName(name);

        const rabbitMQ_message = {
          table: "customer",
          action: "deleteOne",
          data: name,
        };
        await UnsentMessageRepository.saveMessage(
          rabbitMQ_message,
          RABBITMQ_CONFIG.exchange.broadcast,
          transactionalEntityManager
        );
        return deletedCustomer;
      });
      res.status(200).json({
        message: "Customer deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 6. Delete all customers
  async deleteAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        await CustomerRepository.deleteAllCustomers();

        const rabbitMQ_message = {
          table: "customer",
          action: "deleteAll",
        };
        await UnsentMessageRepository.saveMessage(
          rabbitMQ_message,
          RABBITMQ_CONFIG.exchange.broadcast,
          transactionalEntityManager
        );
      });
      res.status(200).json({
        message: "All customers deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
