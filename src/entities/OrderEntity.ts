import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { CentralOperation } from "./OperationEntity";
import { CentralCustomer } from "./CustomerEntity";
import { order_method_enum, order_type_enum } from "../enums/databaseEnums";

@Entity()
export class CentralOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branch_name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  total_price: number;

  @Column({
    type: "enum",
    enum: order_type_enum,
    default: order_type_enum.SELL,
  })
  order_type: order_type_enum;

  @Column({
    type: "enum",
    enum: order_method_enum,
    default: order_method_enum.ONSITE,
  })
  order_method: order_method_enum;

  @Column()
  date: Date;

  @ManyToOne(() => CentralCustomer, (customer) => customer.orders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "customer_phone_number" })
  customer: CentralCustomer;

  @OneToMany(() => CentralOperation, (operation) => operation.order)
  operations: CentralOperation[];
}
