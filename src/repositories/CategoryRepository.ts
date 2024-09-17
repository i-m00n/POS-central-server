import { AppDataSource } from "../config/database.config";
import { CategoryResponseDTO } from "../dtos/category/CategoryResponseDTO";
import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { DeleteCategoryDTO } from "../dtos/category/DeleteCategoryDTO";
import { UpdateCategoryNameDTO } from "../dtos/category/UpdateCategoryNameDTO";
import { CentralCategory } from "../entities/CategoryEntity";
import { NotFoundError } from "../utils/CustomError";

export const CategoryRepository = AppDataSource.getRepository(CentralCategory).extend({
  async createCategory(categoryData: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    // Create a new category entity from the provided data
    const category = CategoryRepository.create(categoryData);

    // Save the category to the database
    const savedCategory = await CategoryRepository.save(category);

    // Map the saved entity to CategoryResponseDTO
    const categoryResponseDTO: CategoryResponseDTO = {
      name: savedCategory.name,
    };

    return categoryResponseDTO;
  },

  async getAllCategories(): Promise<CategoryResponseDTO[]> {
    const categories = await CategoryRepository.find({
      order: {
        id: "ASC",
      },
    });

    if (!categories || categories.length === 0) {
      throw new NotFoundError("No categories found");
    }

    // Map raw entities to CategoryResponseDTO
    const categoryResponseDTOs: CategoryResponseDTO[] = categories.map((category) => ({
      name: category.name,
    }));

    return categoryResponseDTOs;
  },

  async updateCategoryName(dto: UpdateCategoryNameDTO): Promise<CategoryResponseDTO> {
    const { currentName, newName } = dto;

    // Find the category by current name
    const category = await CategoryRepository.findOneBy({ name: currentName });
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    // Update the category name
    category.name = newName;

    // Save the updated category
    const updatedCategory = await CategoryRepository.save(category);

    // Map the updated entity to CategoryResponseDTO
    const categoryResponseDTO: CategoryResponseDTO = {
      name: updatedCategory.name,
    };

    return categoryResponseDTO;
  },

  async deleteCategory(dto: DeleteCategoryDTO): Promise<CategoryResponseDTO> {
    const category = await this.findOneBy({ name: dto.name });
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    console.log(category);

    await this.remove(category);
    return {
      name: category.name,
    };
  },
});
