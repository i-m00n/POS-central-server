import { IsDecimal, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { customer_class_enum } from "../../enums/databaseEnums";

export class CreateCustomerDTO{
    @IsString()
    @IsNotEmpty()
    phone_number:string;

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsDecimal()
    @IsNotEmpty()
    total_paid:number;

    @IsNotEmpty()
    @IsEnum(customer_class_enum)
    class:customer_class_enum;
}