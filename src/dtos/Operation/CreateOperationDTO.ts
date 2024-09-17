import { Transform } from "class-transformer";
import { IsNumber, IsDecimal, IsNotEmpty, IsPositive } from "class-validator";

export class CreateOperationDTO {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @Transform(({ value }) => value.toString(), { toClassOnly: true })
  @IsDecimal({ decimal_digits: "2" })
  @IsNotEmpty()
  total_price: string;

  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
