import { order_method_enum, order_type_enum } from "../../enums/databaseEnums";
import { OperationResponseDTO } from "../Operation/OperationResponseDTO";

export class OrderResponseDTO {
  id?: number;
  total_price?: number;
  order_type?: order_type_enum;
  order_method?: order_method_enum;
  date?: Date;
  customer_phone_number?: string;
  operations?: OperationResponseDTO[];
}
