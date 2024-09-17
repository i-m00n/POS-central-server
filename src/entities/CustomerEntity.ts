import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { CentralOrder } from "./OrderEntity.js";
import { customer_class_enum } from "../enums/databaseEnums";

@Entity()
export class CentralCustomer {
  @PrimaryColumn()
  phone_number: string;

  @Column()
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  total_paid: number;

  @Column({
    type: "enum",
    enum: customer_class_enum,
    default: customer_class_enum.CLIENT,
  })
  class: customer_class_enum;

  @OneToMany(() => CentralOrder, (order) => order.customer)
  orders: CentralOrder[];
}
