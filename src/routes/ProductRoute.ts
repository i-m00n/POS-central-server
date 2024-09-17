import {Router} from "express";
import { ProductController } from "../controllers/ProductController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { create } from "domain";
import { CreateProductDTO } from "../dtos/Product/CreateProductDTO";
import { UpdateProductQuantityDTO } from "../dtos/Product/UpdateProductQuantityDTO";
import { UpdateProductPriceDTO } from "../dtos/Product/UpdateProductPriceDTO";
import { DeleteProductDTO } from "../dtos/Product/DeleteProductDTO";


const router = Router()
const productController = new ProductController();

router 
    .route("/product")
    .get(productController.getAllProducts)
    .post(validationMiddleware(CreateProductDTO),productController.createProduct)
    .delete(productController.deleteAllProducts)
    .delete(validationMiddleware(DeleteProductDTO, "query"), productController.deleteProduct)


router
    .route("/product/quantity")
    .patch(validationMiddleware(UpdateProductQuantityDTO),productController.updateProductQuantity);

router
    .route("/product/price")
    .patch(validationMiddleware(UpdateProductPriceDTO),productController.updateProductPrice);

export default router;


