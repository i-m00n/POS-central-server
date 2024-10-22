import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateCustomerDTO } from "../dtos/Customer/CreateCustomerDTO";
import { GetFilteredCustomersDTO } from "../dtos/Customer/GetFilteredCustomersDTO";
import { UpdateCustomerTotalPaidDTO } from "../dtos/Customer/UpdateCustomerTotalPaidDTO";
import { DeleteCustomerDTO } from "../dtos/Customer/DeleteCustomerDTO";

const router = Router();
const customerController = new CustomerController();

router
  .route("/customer")
  .post(validationMiddleware(CreateCustomerDTO), customerController.createCustomer)
  .delete(validationMiddleware(DeleteCustomerDTO, "query"), customerController.deleteCustomerByName);

router.route("/customer/all").get(customerController.getAllCustomers).delete(customerController.deleteAllCustomers);

router
  .route("/customer/total_paid")
  .patch(validationMiddleware(UpdateCustomerTotalPaidDTO), customerController.updateCustomerTotalPaid);

router
  .route("/customer/filter")
  .get(validationMiddleware(GetFilteredCustomersDTO, "query"), customerController.getFilteredCustomers);

export default router;
