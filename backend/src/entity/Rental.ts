import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Customer } from "./Customer";
  import { Vehicle } from "./Vehicle";
  
  @Entity()
  export class Rental {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Customer, customer => customer.rentals)
    customer!: Customer;
  
    @ManyToOne(() => Vehicle, vehicle => vehicle.rentals, { onDelete: "CASCADE" })
    vehicle!: Vehicle;
  
    @Column()
    startDate!: Date;
  
    @Column({ type: 'date', nullable: true })
    endDate!: Date;
  
    @Column("decimal", { nullable: true })
    distanceKm!: number;
  
    @Column({ default: false })
    damaged!: boolean;
  
    @Column("decimal", { nullable: true })
    totalPrice!: number;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  