import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCustomerDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
