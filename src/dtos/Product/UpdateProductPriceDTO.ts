import { IsString,IsNotEmpty, IsDecimal, IsPositive } from "class-validator";

export class UpdateProductPriceDTO{
    
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsDecimal()
    @IsPositive()
    price:number;
}