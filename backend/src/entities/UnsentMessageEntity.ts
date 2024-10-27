import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class UnsentMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("jsonb")
  message: any;

  @Column()
  queue: string;

  @CreateDateColumn()
  createdAt: Date;
}
