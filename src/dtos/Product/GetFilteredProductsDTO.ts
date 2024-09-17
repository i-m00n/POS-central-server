import { IsDecimal, IsOptional, IsString } from "class-validator";

export class GetFilteredProductsDTO{
    @IsString()
    @IsOptional()
    name?:string;

    @IsString()
    @IsOptional()
    measure?:string;

    @IsString()
    @IsOptional()
    category?:string;

    
    @IsOptional()
    quantity?:number;

    @IsDecimal()
    @IsOptional()
    price?:number;



}