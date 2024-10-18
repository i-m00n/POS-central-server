import { Request, Response, NextFunction } from "express";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { UpdateCategoryNameDTO } from "../dtos/category/UpdateCategoryNameDTO";
import { DeleteCategoryDTO } from "../dtos/category/DeleteCategoryDTO";
import { NotFoundError } from "../utils/CustomError";
import { RabbitMQPublisher } from "../message_brokers/rabbitmq.publisher";

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
      const dto: CreateCategoryDTO = req.body;
      const category = await CategoryRepository.createCategory(dto);

      const rabbitMQ_message = {
        table: "category",
        action: "create",
        data: dto,
      };
      await RabbitMQPublisher.broadcastMessage(rabbitMQ_message);

      res.status(201).json({
        message: "category created successfully",
        data: category,
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
      const dto: UpdateCategoryNameDTO = req.body;
      const updatedCategory = await CategoryRepository.updateCategoryName(dto);

      const rabbitMQ_message = {
        table: "category",
        action: "updateName",
        data: dto,
      };
      await RabbitMQPublisher.broadcastMessage(rabbitMQ_message);

      res.status(201).json({
        message: "category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async DeleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.query.name as string;

      if (!name) {
        throw new NotFoundError("Category name is required");
      }

      // Create a DeleteCategoryDTO
      const deleteCategoryDTO: DeleteCategoryDTO = { name };

      // Call the repository method to delete the category
      const deletedCategory = await CategoryRepository.deleteCategory(deleteCategoryDTO);

      const rabbitMQ_message = {
        table: "category",
        action: "deleteOne",
        data: deleteCategoryDTO,
      };
      await RabbitMQPublisher.broadcastMessage(rabbitMQ_message);

      // Respond with the deleted category data
      res.status(200).json({
        message: "Category deleted successfully",
        data: deletedCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async DeleteAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedCategories = await CategoryRepository.deleteAllCategories();
      const rabbitMQ_message = {
        table: "category",
        action: "deleteAll",
      };
      await RabbitMQPublisher.broadcastMessage(rabbitMQ_message);

      // Respond with the deleted category data
      res.status(200).json({
        message: "Category deleted successfully",
        data: deletedCategories,
      });
    } catch (error) {
      next(error);
    }
  }
}
