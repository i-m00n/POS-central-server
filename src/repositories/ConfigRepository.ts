import { AppDataSource } from "../config/database.config";
import { ConfigResponseDTO } from "../dtos/config/ConfigResponseDTO";
import { CreateConfigDTO } from "../dtos/config/CreateConfigDTO";
import { UpdateConfigDTO } from "../dtos/config/UpdateConfigDTO";
import { CentralConfig } from "../entities/ConfigEntity";
import { NotFoundError } from "../utils/CustomError";

export const ConfigRepository = AppDataSource.getRepository(CentralConfig).extend({
  async getConfigByKey(key: string): Promise<ConfigResponseDTO> {
    const config = await this.findOne({ where: { key } });
    if (!config) {
      throw new NotFoundError(`Configuration with key ${key} not found.`);
    }
    return new ConfigResponseDTO(config);
  },

  async updateConfigValue(updateConfigDTO: UpdateConfigDTO): Promise<ConfigResponseDTO> {
    const config = await this.findOne({ where: { key: updateConfigDTO.key } });
    if (!config) {
      throw new NotFoundError(`Configuration with key ${updateConfigDTO.key} not found.`);
    }
    config.value = updateConfigDTO.value;
    const updatedConfig = await this.save(config);
    return new ConfigResponseDTO(updatedConfig);
  },

  async createConfig(createConfigDTO: CreateConfigDTO): Promise<ConfigResponseDTO> {
    const { key, value } = createConfigDTO;
    const newConfig = this.create({ key, value });
    const savedConfig = await this.save(newConfig);
    return new ConfigResponseDTO(savedConfig);
  },
});
