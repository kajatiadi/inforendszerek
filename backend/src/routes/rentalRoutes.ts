const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../ormconfig");
const { Rental } = require("../entity/Rental");
const { Vehicle } = require("../entity/Vehicle");
const { Customer } = require("../entity/Customer");
import { Request, Response, NextFunction } from "express";

const rentalRepo = AppDataSource.getRepository(Rental);
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const customerRepo = AppDataSource.getRepository(Customer);

// Kölcsönzés létrehozása
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { customerId, vehicleId, startDate } = req.body;

  if (!customerId || !vehicleId || !startDate) {
    return res.status(400).json({ message: "Hiányzó mezők a kölcsönzéshez." });
  }

  try {
    const customer = await customerRepo.findOneBy({ id: customerId });
    const vehicle = await vehicleRepo.findOneBy({ id: vehicleId });

    if (!customer || !vehicle) {
      return res.status(404).json({ message: "Ügyfél vagy jármű nem található." });
    }

    if (vehicle.status !== "free") {
      return res.status(400).json({ message: "A jármű nem elérhető." });
    }

    const rental = rentalRepo.create({
      customer,
      vehicle,
      startDate: new Date(startDate),
    });

    vehicle.status = "rented";

    await vehicleRepo.save(vehicle);
    const savedRental = await rentalRepo.save(rental);

    res.status(201).json(savedRental);
  } catch (err) {
    next(err);
  }
});

// Visszahozatal és díjszámítás
router.post("/:id/return", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { endDate, distanceKm, damaged } = req.body;

  try {
    const rental = await rentalRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["vehicle"],
    });

    if (!rental || rental.endDate) {
      return res.status(404).json({ message: "Érvénytelen kölcsönzés vagy már visszahozták." });
    }

    const vehicle = rental.vehicle;
    const start = new Date(rental.startDate);
    const end = new Date(endDate);
    const diffTime = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const days = Math.max(1, diffTime);

    let price = days * Number(vehicle.baseRate) + Number(distanceKm) * Number(vehicle.kmRate);
    if (damaged) price += 50000; // fix pótdíj

    rental.endDate = end;
    rental.distanceKm = distanceKm;
    rental.damaged = damaged;
    rental.totalPrice = price;

    vehicle.status = "free";

    await rentalRepo.save(rental);
    await vehicleRepo.save(vehicle);

    res.json({ message: "Jármű visszahozva", price });
  } catch (err) {
    next(err);
  }
});

// Összes kölcsönzés listázása
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rentals = await rentalRepo.find({
      relations: ["customer", "vehicle"],
      order: { startDate: "DESC" },
    });
    res.json(rentals);
  } catch (err) {
    next(err);
  }
});

// Aktív kölcsönzések listázása
router.get("/active", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rentals = await rentalRepo.find({
      where: { endDate: null },
      relations: ["customer", "vehicle"],
    });
    res.json(rentals);
  } catch (err) {
    next(err);
  }
});

// Kölcsönzés törlése
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const rental = await rentalRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["vehicle"]
    });

    if (!rental) {
      return res.status(404).json({ message: "Kölcsönzés nem található" });
    }

    // Ha aktív kölcsönzés, állítsuk vissza a jármű állapotát
    if (!rental.endDate && rental.vehicle) {
      rental.vehicle.status = "free";
      await vehicleRepo.save(rental.vehicle);
    }

    await rentalRepo.remove(rental);
    res.status(204).send();
  } catch (err) {
    console.error("Törlési hiba:", err);
    res.status(500).json({ message: "Szerver hiba a törlés során" });
  }
});

export default router;