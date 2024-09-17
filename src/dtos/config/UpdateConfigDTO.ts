import { IsString, IsNotEmpty } from "class-validator";

export class UpdateConfigDTO {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}
