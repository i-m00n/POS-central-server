import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { UpdateCategoryNameDTO } from "../dtos/category/UpdateCategoryNameDTO";
import { DeleteCategoryDTO } from "../dtos/category/DeleteCategoryDTO";

const router = Router();
const categoryController = new CategoryController();

router
  .route("/category")
  .get(categoryController.getAllCategories)
  .post(validationMiddleware(CreateCategoryDTO), categoryController.createCategory)
  .put(validationMiddleware(UpdateCategoryNameDTO), categoryController.updateCategoryName)
  .delete(validationMiddleware(DeleteCategoryDTO, "query"), categoryController.DeleteCategory);

export default router;
