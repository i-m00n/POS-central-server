import { IsNumber, IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  measure: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}
