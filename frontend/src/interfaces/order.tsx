
export enum order_type_enum {
    SELL = "بيع",
    RETURN = "استرجاع",
  }
  export enum order_method_enum {
    DELIVERY = "دليفري",
    ONSITE = "محل",
  }
  export class OperationResponseDTO {
    quantity?: number;
  
    totalPrice?: number;
  
    order_id?: number;
  
    product_name?: string;
  
    product_id?: number | null;
  }
  
export interface Order{
    id:number,
    customer_phone_number:string,
    date:string,
    order_type?:order_type_enum,
    order_method?:order_method_enum,
    total_price:number,
    operations:OperationResponseDTO[]

}
