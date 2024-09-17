import { Router } from "express";
import { ConfigController } from "../controllers/ConfigController";
import { validationMiddleware } from "../middlewares/ValidationMiddleware";
import { CreateConfigDTO } from "../dtos/config/CreateConfigDTO";
import { UpdateConfigDTO } from "../dtos/config/UpdateConfigDTO";

const router = Router();
const configController = new ConfigController();

router.get("/config/:key", configController.getConfigByKey);
router
  .route("/config")
  .post(validationMiddleware(CreateConfigDTO), configController.createConfig)
  .put(validationMiddleware(UpdateConfigDTO), configController.updateConfigValue);

export default router;
