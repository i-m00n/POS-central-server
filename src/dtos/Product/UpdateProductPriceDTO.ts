import { IsString, IsNotEmpty, IsDecimal, IsPositive } from "class-validator";

export class UpdateProductPriceDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;
}
