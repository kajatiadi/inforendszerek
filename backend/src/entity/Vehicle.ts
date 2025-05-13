import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Rental } from "./Rental";

export type VehicleStatus = "free" | "fented";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string; 

  @Column()
  manufacturer!: string;

  @Column()
  model!: string;

  @Column()
  licensePlate!: string;

  @Column()
  acquisitionDate!: Date;

  @Column()
  serialNumber!: string;

  @Column("decimal")
  baseRate!: number;

  @Column("decimal")
  kmRate!: number;

  @Column({ type: "enum", enum: ["free", "rented"], default: "free" })
  status!: VehicleStatus;

  @OneToMany(() => Rental, rental => rental.vehicle)
  rentals!: Rental[];
}
