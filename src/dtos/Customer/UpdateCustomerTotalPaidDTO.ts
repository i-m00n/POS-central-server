import { IsNotEmpty, IsString, IsDecimal } from "class-validator";

export class UpdateCustomerTotalPaidDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsDecimal()
  @IsNotEmpty()
  total_paid: number;

  constructor(phone_number: string, total_paid: number) {
    this.phone_number = phone_number;
    this.total_paid = total_paid;
  }
}
