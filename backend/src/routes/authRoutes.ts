const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../ormconfig");
const { User } = require("../entity/User");

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);
const JWT_SECRET = "titkos_jelszo";

// Regisztráció
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Minden mező kötelező." });
  }

  try {
    const existingUser = await userRepo.findOneBy({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Ez a felhasználónév már foglalt." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = userRepo.create({ username, password: hashed, role });
    const saved = await userRepo.save(newUser);

    res.status(201).json({ id: saved.id, username: saved.username, role: saved.role });
  } catch (err) {
    next(err);
  }
});

// Bejelentkezés
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  try {
    const user = await userRepo.findOneBy({ username });
    if (!user) {
      return res.status(401).json({ message: "Hibás felhasználónév vagy jelszó." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Hibás felhasználónév vagy jelszó." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    next(err);
  }
});

export default router;
