import { IsString, IsNotEmpty, IsDecimal, IsPositive, IsOptional } from "class-validator";

export class UpdateProductDataDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  new_name?: string;

  @IsDecimal()
  @IsOptional()
  price?: number;
}
