import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type Role = "admin" | "dolgozo";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: ["admin", "dolgozo"] })
  role!: Role;
}
