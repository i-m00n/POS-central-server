import { IsEnum, IsOptional, IsDate } from "class-validator";
import { order_method_enum, order_type_enum } from "../../enums/databaseEnums";

export class GetFilteredOrderDTO {
  @IsEnum(order_type_enum)
  @IsOptional()
  order_type?: order_type_enum;

  @IsEnum(order_method_enum)
  @IsOptional()
  order_method?: order_method_enum;

  @IsDate()
  @IsOptional()
  start_date?: Date;

  @IsDate()
  @IsOptional()
  end_date?: Date;
}
