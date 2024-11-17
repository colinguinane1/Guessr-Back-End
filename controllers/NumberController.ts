import { Request, Response } from "express";
const NumberModel = require(`../models/NumberModel`);

const difficulties = [
  { name: "easy", max: 10, attempts: 4, order: 1 },
  { name: "medium", max: 200, attempts: 8, order: 2 },
  { name: "hard", max: 1500, attempts: 15, order: 3 },
  { name: "impossible", max: 10000, attempts: 25, order: 4 },
];

const randomNumber = (max: number) => {
  return Math.floor(Math.random() * (max - 1 + 1)) + 1;
};

const createNumberController = async (req: Request, res: Response) => {
  const checkExpired = async () => {
    const currentNumber = await NumberModel.findOne({}).sort({ _id: -1 });
    if (!currentNumber) {
      console.log("No number found.");
      return true; // No number found in DB
    } else {
      const numberExpiry = currentNumber.expires;
      const numberCreated = currentNumber.created;

      const twentyFourHours = 24 * 60 * 60 * 1000;

      const isExpired = Date.now() - numberCreated >= twentyFourHours;

      console.log(numberCreated, numberExpiry + "here");
      console.log(isExpired + "here2");

      return isExpired;
    }
  };

  console.log(await checkExpired());

  if (await checkExpired()) {
    try {
      const numberDocuments = difficulties.map((difficulty) => ({
        difficulty: difficulty.name,
        max: difficulty.max,
        value: randomNumber(difficulty.max),
        order: difficulty.order,
        attempts: difficulty.attempts,
        expires: Date.now() + 24 * 60 * 60 * 1000, // Adds 24 hours to the current date
        global_user_guesses: 0,
      }));

      // Use insertMany to reduce the number of individual operations
      const createdNumbers = await NumberModel.insertMany(numberDocuments);

      res.status(200).json(createdNumbers);
    } catch (error) {
      console.error("Error creating numbers:", error); // For debugging
      res.status(500).json({
        message: "Error creating number",
        error: (error as Error).message,
      });
    }
  } else {
    return res.status(200).json({
      message: "The number hasn't expired yet.",
    });
  }
};

const getAllNumbers = async (req: Request, res: Response) => {
  try {
    const numbers = await NumberModel.find({});
    res.status(200).json(numbers);
  } catch (error) {
    res.status(400).json({ ok: "no", error: (error as Error).message });
  }
};

const getCurrentNumbers = async (req: Request, res: Response) => {
  try {
    const numbers = await NumberModel.find({}).sort({ max: +1 }).limit(4);
    res.status(200).json(numbers);
  } catch (error) {
    res.status(400).json({ ok: "no", error: (error as Error).message });
  }
};

export { createNumberController, getAllNumbers, getCurrentNumbers };
