const express = require('express');
const router = express.Router();
const { AppDataSource } = require("../ormconfig");
const { Customer } = require("../entity/Customer");

const customerRepo = AppDataSource.getRepository(Customer);

import { Request, Response, NextFunction } from 'express';

// Új ügyfél létrehozása 
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { fullName, address, idNumber, phoneNumber } = req.body;

  if (!fullName || !address || !idNumber || !phoneNumber) {
    return res.status(400).json({ message: "Minden mező kitöltése kötelező." });
  }

  try {
    const newCustomer = customerRepo.create({ fullName, address, idNumber, phoneNumber });
    const savedCustomer = await customerRepo.save(newCustomer);
    res.status(201).json(savedCustomer);
  } catch (err) {
    next(err);
  }
});

// Ügyfelek listázása
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await customerRepo.find();
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

// Ügyfél törlése
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const result = await customerRepo.delete(id);

    if (result.affected === 0) {
      return res.status(404).json({ message: "Az ügyfél nem található." });
    }

    res.json({ message: "Ügyfél sikeresen törölve." });
  } catch (err) {
    next(err);
  }
});


export default router;
