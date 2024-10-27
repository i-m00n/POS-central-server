import { IsDecimal, IsEnum, IsOptional, IsString } from "class-validator";
import { customer_class_enum } from "../../enums/databaseEnums";

export class GetFilteredCustomersDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDecimal()
  @IsOptional()
  total_paid?: number;

  @IsEnum(customer_class_enum)
  @IsOptional()
  class?: customer_class_enum;

  @IsString()
  @IsOptional()
  phone_number?: string;
}
