import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateProductDTO } from "../dtos/Product/CreateProductDTO";
import { UpdateProductDataDTO } from "../dtos/Product/UpdateProductPriceDTO";
import { DeleteProductDTO } from "../dtos/Product/DeleteProductDTO";
import { GetFilteredOrderDTO } from "../dtos/Order/GetFilteredOrderDTO";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const productController = new ProductController();

router
  .route("/product")
  .post(authMiddleware, validationMiddleware(CreateProductDTO), productController.createProduct)
  .delete(authMiddleware, validationMiddleware(DeleteProductDTO, "query"), productController.deleteProduct)
  .patch(authMiddleware, validationMiddleware(UpdateProductDataDTO), productController.updateProductData);

router.get(
  "/product/filter",
  authMiddleware,
  validationMiddleware(GetFilteredOrderDTO),
  productController.getFilteredProducts
);

router
  .route("/product/all")
  .get(authMiddleware, productController.getAllProducts)
  .delete(authMiddleware, productController.deleteAllProducts);

export default router;
