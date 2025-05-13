import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./ormconfig";
import dotenv from "dotenv";
import cors from "cors";
import vehicleRoutes from "./routes/vehicleRoutes";
import customerRoutes from "./routes/customerRoutes";
import rentalRoutes from "./routes/rentalRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:4200", credentials: true }));

// Middleware
app.use(express.json());

// API routeok
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Adatbázis kapcsolat létrejött");
    app.listen(PORT, () => {
      console.log(`Szerver fut a ${PORT} porton`);
    });
  })
  .catch((error) => {
    console.error("Adatbázis kapcsolódási hiba:", error);
  });
