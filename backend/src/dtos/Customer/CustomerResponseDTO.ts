import { customer_class_enum } from "../../enums/databaseEnums";

export class CustomerResponseDTO {
  phone_number?: string;
  class?: customer_class_enum;
  name?: string;
  total_paid?: number;
}
