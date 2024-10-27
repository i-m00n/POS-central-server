import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CentralConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  value: string;
}
