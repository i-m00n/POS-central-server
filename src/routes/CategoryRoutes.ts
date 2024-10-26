import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { UpdateCategoryNameDTO } from "../dtos/category/UpdateCategoryNameDTO";
import { DeleteCategoryDTO } from "../dtos/category/DeleteCategoryDTO";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const categoryController = new CategoryController();

router
  .route("/category")
  .post(authMiddleware, validationMiddleware(CreateCategoryDTO), categoryController.createCategory)
  .patch(authMiddleware, validationMiddleware(UpdateCategoryNameDTO), categoryController.updateCategoryName)
  .delete(authMiddleware, validationMiddleware(DeleteCategoryDTO, "query"), categoryController.DeleteCategory);

router
  .route("/category/all")
  .get(authMiddleware, categoryController.getAllCategories)
  .delete(authMiddleware, categoryController.DeleteAllCategories);

export default router;
