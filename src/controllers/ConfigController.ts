import { Request, Response, NextFunction } from "express";
import { ConfigRepository } from "../repositories/ConfigRepository";
import { CreateConfigDTO } from "../dtos/config/CreateConfigDTO";
import { UpdateConfigDTO } from "../dtos/config/UpdateConfigDTO";

export class ConfigController {
  constructor() {
    this.updateConfigValue = this.updateConfigValue.bind(this);
    this.getConfigByKey = this.getConfigByKey.bind(this);
    this.createConfig = this.createConfig.bind(this);
  }

  // Method to update a configuration value
  async updateConfigValue(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value } = req.body;

      // Create UpdateConfigDTO instance
      const updateConfigDTO = new UpdateConfigDTO(key, value);

      // Call repository method
      const updatedConfig = await ConfigRepository.updateConfigValue(updateConfigDTO);

      res.status(200).json({
        message: "Config updated successfully",
        config: updatedConfig,
      });
    } catch (error) {
      next(error);
    }
  }

  // Method to retrieve a configuration by key
  async getConfigByKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;

      // Call repository method
      const config = await ConfigRepository.getConfigByKey(key);

      res.status(200).json({
        message: "Config fetched successfully",
        config,
      });
    } catch (error) {
      next(error);
    }
  }

  // Method to create a new configuration
  async createConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value } = req.body;
      // Create CreateConfigDTO instance
      const createConfigDTO = new CreateConfigDTO(key, value);

      // Call repository method
      const newConfig = await ConfigRepository.createConfig(createConfigDTO);

      res.status(201).json({
        message: "Config created successfully",
        config: newConfig,
      });
    } catch (error) {
      next(error);
    }
  }
}
