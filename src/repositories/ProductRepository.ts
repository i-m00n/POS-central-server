import { AppDataSource } from "../config/database.config";
import { CentralProduct } from "../entities/ProductEntity";
import { NotFoundError } from "../utils/CustomError";
import { UpdateProductQuantityDTO } from "../dtos/Product/UpdateProductQuantityDTO";
import { ProductResponseDTO } from "../dtos/Product/ProductResponseDTO";
import { Not } from "typeorm";
import { GetFilteredOrderDTO } from "../dtos/Order/GetFilteredOrderDTO";
import { GetFilteredProductsDTO } from "../dtos/Product/GetFilteredProductsDTO";
import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { CreateProductDTO } from "../dtos/Product/CreateProductDTO";
import { UpdateProductPriceDTO } from "../dtos/Product/UpdateProductPriceDTO";
import { DeleteProductDTO } from "../dtos/Product/DeleteProductDTO";

export const ProductRepository = AppDataSource.getRepository(CentralProduct).extend({
  async updateProductPrice(dto: UpdateProductPriceDTO): Promise<ProductResponseDTO> {
    const product = await ProductRepository.findOneBy({ name: dto.name });
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    product.price = dto.price;
    const updatedProduct = await ProductRepository.save(product);

    ////// check for the rest of enitites
    const productResponseDTO: ProductResponseDTO = {
      name: updatedProduct.name,
      id: updatedProduct.id,
      price: updatedProduct.price,
      measure: updatedProduct.measure,
      category: product.category.name,
    };
    return productResponseDTO;
  },

  async getAllProducts(): Promise<ProductResponseDTO[]> {
    const products = await ProductRepository.find({
      order: {
        id: "ASC",
      },
    });
    if (!products || products.length == 0) {
      throw new NotFoundError("No products found");
    }
    ////// check for the rest of enitites
    const productResponseDTO: ProductResponseDTO[] = products.map((product) => ({
      name: product.name,
      id: product.id,
      price: product.price,
      measure: product.measure,
      category: product.category.name,
    }));
    return productResponseDTO;
  },
  async getFilteredProducts(dto: GetFilteredProductsDTO): Promise<ProductResponseDTO[]> {
    const queryBuilder = ProductRepository.createQueryBuilder("product").leftJoinAndSelect(
      "product.category",
      "category"
    );
    //including data from related tables
    // each product belongs to a category Many2one
    if (dto.name) {
      queryBuilder.andWhere("product.name LIKE :name", { name: `%${dto.name}%` });
    }
    if (dto.measure) {
      queryBuilder.andWhere("product.measure = :measure", { measure: dto.measure });
    }
    if (dto.quantity) {
      queryBuilder.andWhere("product.quantity = :quantity", { quantity: dto.quantity });
    }
    if (dto.price) {
      queryBuilder.andWhere("product.price = :price", { price: dto.price });
    }
    if (dto.category) {
      queryBuilder.andWhere("category.name LIKE :category", { category: `%${dto.category}%` });
    }
    dto;

    const products = await queryBuilder.getMany();

    if (!products || products.length === 0) {
      throw new NotFoundError("No products found with the provided filters");
    }

    //responding with everything???
    const productResponseDTO: ProductResponseDTO[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      measure: product.measure,
      price: product.price,
      category: product.category.name,
    }));

    return productResponseDTO;
  },

  async createProduct(productData: CreateProductDTO): Promise<ProductResponseDTO> {
    //findone
    const category = await ProductRepository.findOne({
      where: { id: productData.categoryId },
    });
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const product = ProductRepository.create({
      name: productData.name,
      measure: productData.measure,
      price: productData.price,
      category: category,
    });

    const savedProduct = await ProductRepository.save(product);

    const productResponseDTO: ProductResponseDTO = {
      id: savedProduct.id,
      name: savedProduct.name,
      measure: savedProduct.measure,
      price: savedProduct.price,
      category: savedProduct.category.name,
    };

    return productResponseDTO;
  },

  async deleteProduct(dto: DeleteProductDTO): Promise<ProductResponseDTO> {
    const product = await this.findOne({ where: { name: dto.name } });
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    await this.remove(product);
    const productResponseDTO: ProductResponseDTO = {
      id: product.id,
      name: product.name,
      measure: product.measure,
      price: product.price,
      category: product.category.name,
    };

    return productResponseDTO;
  },

  async deleteAllProducts(): Promise<void> {
    const products = await ProductRepository.find();
    if (products.length == 0) {
      throw new NotFoundError("No products to delete");
    }
    await ProductRepository.remove(products);
  },
});
