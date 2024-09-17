import { CentralConfig } from "../../entities/ConfigEntity";

export class ConfigResponseDTO {
  key: string;
  value: string;

  constructor(config: CentralConfig) {
    this.key = config.key;
    this.value = config.value;
  }
}
