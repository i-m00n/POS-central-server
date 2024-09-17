import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CentralOrder } from "./OrderEntity";
import { CentralProduct } from "./ProductEntity";

@Entity()
export class CentralOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total_price: number;

  @ManyToOne(() => CentralOrder, (order) => order.operations)
  @JoinColumn({ name: "order_id" })
  order: CentralOrder;

  @ManyToOne(() => CentralProduct, (product) => product.operations, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "product_id" })
  product: CentralProduct | null;
}
