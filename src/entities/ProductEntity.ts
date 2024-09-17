import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { CentralCategory } from "./CategoryEntity";
import { CentralOperation } from "./OperationEntity";

@Entity()
export class CentralProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  measure: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => CentralCategory, (category) => category.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category: CentralCategory;

  @OneToMany(() => CentralOperation, (operation) => operation.product, { onDelete: "SET NULL" })
  operations: CentralOperation[];
}
