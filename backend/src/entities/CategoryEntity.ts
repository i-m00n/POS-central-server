import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CentralProduct } from "./ProductEntity";

@Entity()
export class CentralCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CentralProduct, (product) => product.category)
  products: CentralProduct[];
}
