import { IsNotEmpty, IsString, IsDecimal } from "class-validator";

export class UpdateCustomerTotalPaidDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsDecimal()
  @IsNotEmpty()
  total_paid: number;
}
