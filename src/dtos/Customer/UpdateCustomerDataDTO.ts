import { IsNotEmpty, IsString, IsDecimal, IsOptional } from "class-validator";
import { customer_class_enum } from "../../enums/databaseEnums";

export class UpdateCustomerDataDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  class?: customer_class_enum;

  @IsDecimal()
  @IsOptional()
  total_paid?: number;
}
