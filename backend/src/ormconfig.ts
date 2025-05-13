import { DataSource } from "typeorm";
import { Vehicle } from "./entity/Vehicle";
import { Customer } from "./entity/Customer";
import { Rental } from "./entity/Rental";
import * as dotenv from "dotenv";
import { User } from "./entity/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Vehicle, Customer, Rental, User],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
