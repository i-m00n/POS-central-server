import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateProductDTO } from "../dtos/Product/CreateProductDTO";
import { UpdateProductDataDTO } from "../dtos/Product/UpdateProductPriceDTO";
import { DeleteProductDTO } from "../dtos/Product/DeleteProductDTO";
import { GetFilteredOrderDTO } from "../dtos/Order/GetFilteredOrderDTO";

const router = Router();
const productController = new ProductController();

router
  .route("/product")
  .post(validationMiddleware(CreateProductDTO), productController.createProduct)
  .delete(validationMiddleware(DeleteProductDTO, "query"), productController.deleteProduct)
  .patch(validationMiddleware(UpdateProductDataDTO), productController.updateProductData);

router.get("/product/filter", validationMiddleware(GetFilteredOrderDTO), productController.getFilteredProducts);

router.route("/product/all").get(productController.getAllProducts).delete(productController.deleteAllProducts);

export default router;
