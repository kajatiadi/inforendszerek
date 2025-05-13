import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Rental } from "./Rental";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  address!: string;

  @Column()
  idNumber!: string;

  @Column()
  phoneNumber!: string;

  @OneToMany(() => Rental, rental => rental.customer)
  rentals!: Rental[];
}
