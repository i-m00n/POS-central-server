import { Request, Response, NextFunction } from "express";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { UpdateCategoryNameDTO } from "../dtos/category/UpdateCategoryNameDTO";
import { DeleteCategoryDTO } from "../dtos/category/DeleteCategoryDTO";
import { NotFoundError } from "../utils/CustomError";
import { RabbitMQPublisher } from "../message_brokers/rabbitmq.publisher";
import { AppDataSource } from "../config/database.config";
import { UnsentMessageRepository } from "../repositories/UnsentMessageRepository";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";

export class CategoryController {
  constructor() {
    this.getAllCategories = this.getAllCategories.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategoryName = this.updateCategoryName.bind(this);
    this.DeleteCategory = this.DeleteCategory.bind(this);
    this.DeleteAllCategories = this.DeleteAllCategories.bind(this);
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const dto: CreateCategoryDTO = req.body;

        // Create category within transaction
        const category = await CategoryRepository.createCategory(dto, transactionalEntityManager);

        // Prepare and send RabbitMQ message
        const rabbitMQ_message = {
          table: "category",
          action: "create",
          data: dto,
        };
        await UnsentMessageRepository.saveMessage(
          rabbitMQ_message,
          RABBITMQ_CONFIG.exchange.broadcast,
          transactionalEntityManager
        );

        return category;
      });

      res.status(201).json({
        message: "category created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryRepository.getAllCategories();
      res.status(201).json({
        message: "categories fetched successfully",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategoryName(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const dto: UpdateCategoryNameDTO = req.body;
        const updatedCategory = await CategoryRepository.updateCategoryName(dto, transactionalEntityManager);

        const rabbitMQ_message = {
          table: "category",
          action: "updateName",
          data: dto,
        };
        await UnsentMessageRepository.saveMessage(
          rabbitMQ_message,
          RABBITMQ_CONFIG.exchange.broadcast,
          transactionalEntityManager
        );
        return updatedCategory;
      });

      res.status(201).json({
        message: "category updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async DeleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const name = req.query.name as string;

        if (!name) {
          throw new NotFoundError("Category name is required");
        }

        // Create a DeleteCategoryDTO
        const deleteCategoryDTO: DeleteCategoryDTO = { name };

        // Call the repository method to delete the category
        const deletedCategory = await CategoryRepository.deleteCategory(deleteCategoryDTO, transactionalEntityManager);

        const rabbitMQ_message = {
          table: "category",
          action: "deleteOne",
          data: deleteCategoryDTO,
        };
        await UnsentMessageRepository.saveMessage(
          rabbitMQ_message,
          RABBITMQ_CONFIG.exchange.broadcast,
          transactionalEntityManager
        );

        return deletedCategory;
      });
      // Respond with the deleted category data
      res.status(200).json({
        message: "Category deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async DeleteAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const deletedCategories = await CategoryRepository.deleteAllCategories(transactionalEntityManager);
        const rabbitMQ_message = {
          table: "category",
          action: "deleteAll",
        };
        await UnsentMessageRepository.saveMessage(
          rabbitMQ_message,
          RABBITMQ_CONFIG.exchange.broadcast,
          transactionalEntityManager
        );

        return deletedCategories;
      });

      // Respond with the deleted category data
      res.status(200).json({
        message: "Category deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
