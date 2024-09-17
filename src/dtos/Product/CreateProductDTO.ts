import { IsNumber,IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateProductDTO{
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    measure:string;

    @IsNumber()
    @IsNotEmpty()
    quantity:number;

    @IsDecimal()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    categoryId:number;
    //operations

    
}