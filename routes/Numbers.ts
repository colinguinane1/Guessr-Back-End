const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

const mongoose = require("mongoose");
const NumberModel = require(`../models/NumberModel`);

// Define your routes here
router.get("/", (req: Request, res: Response) => {
  res.json({
    easy: { min: 1, max: 10, number: 5, attempts: 3 },
    medium: { min: 1, max: 200, number: 162, attempts: 8 },
    hard: { min: 1, max: 1500, number: 633, attempts: 14 },
    impossible: { min: 1, max: 10000, number: 6512, attempts: 25 },
  });
});

router.post("/create", async (req: Request, res: Response) => {
  try {
    const randomNumber = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    const createNum = await NumberModel.create({
      difficulty: "easy",
      min: 1,
      max: 10,
      value: randomNumber,
      attempts: 0,
      expires: Date.now() + 24 * 60 * 60 * 1000, // Adds 24 hours to the current date
      global_user_guesses: 0,
    });

    res.json({
      id: createNum._id,
      difficulty: createNum.difficulty,
      value: createNum.value,
      expires: createNum.expires,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating number",
      error: (error as Error).message,
    });
  }
});

// Export the router
module.exports = router;
