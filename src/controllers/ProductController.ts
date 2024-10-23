import { Request, Response, NextFunction } from "express";
import { ProductRepository } from "../repositories/ProductRepository";
import { CreateProductDTO } from "../dtos/Product/CreateProductDTO";
import { GetFilteredProductsDTO } from "../dtos/Product/GetFilteredProductsDTO";
import { ProductResponseDTO } from "../dtos/Product/ProductResponseDTO";
import { UpdateProductDataDTO } from "../dtos/Product/UpdateProductPriceDTO";
import { DeleteProductDTO } from "../dtos/Product/DeleteProductDTO";
import { NotFoundError } from "../utils/CustomError";
import { RabbitMQPublisher } from "../message_brokers/rabbitmq.publisher";
export class ProductController {
  constructor() {
    this.createProduct = this.createProduct.bind(this);
    this.getFilteredProducts = this.getFilteredProducts.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.updateProductData = this.updateProductData.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.deleteAllProducts = this.deleteAllProducts.bind(this);
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData: CreateProductDTO = req.body;
      const product: ProductResponseDTO = await ProductRepository.createProduct(productData);
      const rabbitMQ_message = {
        table: "product",
        action: "create",
        data: productData,
      };
      await RabbitMQPublisher.broadcastMessage(rabbitMQ_message);

      res.status(201).json({
        message: "Product created successfully",
        data: product,
        productId: product.id,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFilteredProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: GetFilteredProductsDTO = req.query;
      const product: ProductResponseDTO[] = await ProductRepository.getFilteredProducts(dto);
      res.status(201).json({
        message: "Filtered products fetched successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const product: ProductResponseDTO[] = await ProductRepository.getAllProducts();
      res.status(201).json({
        message: "Products fetched successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProductData(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: UpdateProductDataDTO = req.body;
      const product: ProductResponseDTO = await ProductRepository.updateProductData(dto);

      const rabbitMQ_message = {
        table: "product",
        action: "updatePrice",
        data: dto,
      };
      await RabbitMQPublisher.broadcastMessage(rabbitMQ_message);

      res.status(200).json({
        message: "Product price updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.query.name as string;

      if (!name) {
        throw new NotFoundError("Product name is required");
      }
      const dto: DeleteProductDTO = { name };

      const deletedCategory = await ProductRepository.deleteProduct(dto);

      const rabbitMQ_message = {
        table: "product",
        action: "deleteOne",
        data: dto,
      };
      await RabbitMQPublisher.broadcastMessage(rabbitMQ_message);

      res.status(200).json({
        message: "Product deleted successfully",
        data: deletedCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductRepository.deleteAllProducts();

      const rabbitMQ_message = {
        table: "product",
        action: "deleteAll",
      };
      await RabbitMQPublisher.broadcastMessage(rabbitMQ_message);

      res.status(200).json({
        message: "All products deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
