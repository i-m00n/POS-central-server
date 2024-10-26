import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateCustomerDTO } from "../dtos/Customer/CreateCustomerDTO";
import { GetFilteredCustomersDTO } from "../dtos/Customer/GetFilteredCustomersDTO";
import { UpdateCustomerDataDTO } from "../dtos/Customer/UpdateCustomerDataDTO";
import { DeleteCustomerDTO } from "../dtos/Customer/DeleteCustomerDTO";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const customerController = new CustomerController();

router
  .route("/customer")
  .post(authMiddleware, validationMiddleware(CreateCustomerDTO), customerController.createCustomer)
  .delete(authMiddleware, validationMiddleware(DeleteCustomerDTO, "query"), customerController.deleteCustomerByName)
  .patch(authMiddleware, validationMiddleware(UpdateCustomerDataDTO), customerController.updateCustomerData);

router
  .route("/customer/all")
  .get(authMiddleware, customerController.getAllCustomers)
  .delete(authMiddleware, customerController.deleteAllCustomers);

router
  .route("/customer/filter")
  .get(authMiddleware, validationMiddleware(GetFilteredCustomersDTO, "query"), customerController.getFilteredCustomers);

export default router;
