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
  .post(validationMiddleware(CreateCategoryDTO), categoryController.createCategory)
  .patch(validationMiddleware(UpdateCategoryNameDTO), categoryController.updateCategoryName)
  .delete(validationMiddleware(DeleteCategoryDTO, "query"), categoryController.DeleteCategory);

router.route("/category/all").get(categoryController.getAllCategories).delete(categoryController.DeleteAllCategories);

export default router;
