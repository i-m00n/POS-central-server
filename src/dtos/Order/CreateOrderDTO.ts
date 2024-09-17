import { IsDecimal, IsNotEmpty, IsEnum, IsDateString, IsString } from "class-validator";
import { order_method_enum, order_type_enum } from "../../enums/databaseEnums";

export class CreateOrderDTO {
  @IsDecimal({ decimal_digits: "2" })
  @IsNotEmpty()
  total_price: string;

  @IsEnum(order_type_enum)
  @IsNotEmpty()
  order_type: order_type_enum;

  @IsEnum(order_method_enum)
  @IsNotEmpty()
  order_method: order_method_enum;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsString()
  customer_phone_number: string;
}
