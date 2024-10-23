import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateCustomerDTO } from "../dtos/Customer/CreateCustomerDTO";
import { GetFilteredCustomersDTO } from "../dtos/Customer/GetFilteredCustomersDTO";
import { UpdateCustomerDataDTO } from "../dtos/Customer/UpdateCustomerDataDTO";
import { DeleteCustomerDTO } from "../dtos/Customer/DeleteCustomerDTO";

const router = Router();
const customerController = new CustomerController();

router
  .route("/customer")
  .post(validationMiddleware(CreateCustomerDTO), customerController.createCustomer)
  .delete(validationMiddleware(DeleteCustomerDTO, "query"), customerController.deleteCustomerByName)
  .patch(validationMiddleware(UpdateCustomerDataDTO), customerController.updateCustomerData);

router.route("/customer/all").get(customerController.getAllCustomers).delete(customerController.deleteAllCustomers);

router
  .route("/customer/filter")
  .get(validationMiddleware(GetFilteredCustomersDTO, "query"), customerController.getFilteredCustomers);

export default router;
