import { EntityManager } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { CategoryResponseDTO } from "../dtos/category/CategoryResponseDTO";
import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { DeleteCategoryDTO } from "../dtos/category/DeleteCategoryDTO";
import { UpdateCategoryNameDTO } from "../dtos/category/UpdateCategoryNameDTO";
import { CentralCategory } from "../entities/CategoryEntity";
import { NotFoundError } from "../utils/CustomError";

export const CategoryRepository = AppDataSource.getRepository(CentralCategory).extend({
  getRepo(transactionalEntityManager?: EntityManager) {
    return transactionalEntityManager ? transactionalEntityManager.getRepository(CentralCategory) : this;
  },

  async createCategory(
    categoryData: CreateCategoryDTO,
    transactionalEntityManager?: EntityManager
  ): Promise<CategoryResponseDTO> {
    const repo = this.getRepo(transactionalEntityManager);

    const category = repo.create(categoryData);
    const savedCategory = await repo.save(category);

    return {
      name: savedCategory.name,
    };
  },

  async getAllCategories(transactionalEntityManager?: EntityManager): Promise<CategoryResponseDTO[]> {
    const repo = this.getRepo(transactionalEntityManager);

    const categories = await repo.find({
      order: {
        id: "ASC",
      },
      relations: ["products"],
    });

    if (!categories || categories.length === 0) {
      throw new NotFoundError("No categories found");
    }

    return categories.map((category) => ({
      name: category.name,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        measure: product.measure,
        price: product.price,
      })),
    }));
  },

  async updateCategoryName(
    dto: UpdateCategoryNameDTO,
    transactionalEntityManager?: EntityManager
  ): Promise<CategoryResponseDTO> {
    const repo = this.getRepo(transactionalEntityManager);
    const { currentName, newName } = dto;

    const category = await repo.findOneBy({ name: currentName });
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    category.name = newName;
    const updatedCategory = await repo.save(category);

    return {
      name: updatedCategory.name,
    };
  },

  async deleteCategory(
    dto: DeleteCategoryDTO,
    transactionalEntityManager?: EntityManager
  ): Promise<CategoryResponseDTO> {
    const repo = this.getRepo(transactionalEntityManager);

    const category = await repo.findOneBy({ name: dto.name });
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    await repo.remove(category);
    return {
      name: category.name,
    };
  },

  async deleteAllCategories(transactionalEntityManager?: EntityManager): Promise<void> {
    const repo = this.getRepo(transactionalEntityManager);

    const categories = await repo.find();
    if (categories.length == 0) {
      throw new NotFoundError("no customers to delete");
    }
    await repo.remove(categories);
  },
});
