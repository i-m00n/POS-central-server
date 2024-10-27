import { IsDecimal, IsOptional, IsString } from "class-validator";

export class GetFilteredProductsDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  measure?: string;

  @IsString()
  @IsOptional()
  category_name?: string;

  @IsDecimal()
  @IsOptional()
  price?: number;
}
