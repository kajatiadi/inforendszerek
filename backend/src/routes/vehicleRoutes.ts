const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../ormconfig");
const { Vehicle } = require("../entity/Vehicle");

// Típusok importálása
import { Request, Response, NextFunction } from 'express';

const vehicleRepo = AppDataSource.getRepository(Vehicle);

// Új jármű regisztrálása
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const {
    type,
    manufacturer,
    model,
    licensePlate,
    acquisitionDate,
    serialNumber,
    status,
  } = req.body;


  if (
    !type ||
    !manufacturer ||
    !licensePlate ||
    !acquisitionDate ||
    !serialNumber
  ) {
    return res.status(400).json({ message: "Minden kötelező mezőt ki kell tölteni." });
  }

  try {
    const newVehicle = vehicleRepo.create({
      type,
      manufacturer,
      model,
      licensePlate,
      acquisitionDate,
      serialNumber,
      baseRate: 2500, // fix díj
      kmRate: 250,    // fix díj
      status: status || "free",
    });

    const savedVehicle = await vehicleRepo.save(newVehicle);
    res.status(201).json(savedVehicle);
  } catch (err) {
    next(err);
  }
});

// Összes jármű lekérdezése
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicles = await vehicleRepo.find();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!vehicle) {
      return res.status(404).json({ message: "Jármű nem található." });
    }

    await vehicleRepo.remove(vehicle);
    res.json({ message: "Jármű törölve." });
  } catch (err) {
    next(err);
  }
});


// Keresés típus vagy rendszám alapján
router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  const { type, licensePlate } = req.query;

  try {
    const query = vehicleRepo.createQueryBuilder("vehicle");

    if (type) {
      query.andWhere("vehicle.type ILIKE :type", { type: `%${type}%` });
    }

    if (licensePlate) {
      query.andWhere("vehicle.licensePlate ILIKE :licensePlate", {
        licensePlate: `%${licensePlate}%`,
      });
    }

    const result = await query.getMany();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
