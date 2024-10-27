import { IsDecimal,IsNotEmpty } from "class-validator";


export class UpdateProductQuantityDTO{

    productID: number;
    
    @IsNotEmpty()
    quantity:number
}