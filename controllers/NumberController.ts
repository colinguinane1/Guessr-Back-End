import { Request, Response } from "express";
import cron from 'node-cron'
const NumberModel = require(`../models/NumberModel`);

const difficulties = [
  { name: "easy", max: 10, attempts: 4, color: "green" },
  { name: "medium", max: 200, attempts: 8, color: "yellow" },
  { name: "hard", max: 1500, attempts: 15, color: "orange" },
  { name: "impossible", max: 10000, attempts: 25, color: "red" },
];

const randomNumber = (max: number) => {
  return Math.floor(Math.random() * max) + 1
};

const createNumberController = async (req: Request, res: Response) => {
  const checkExpired = async () => {
    const currentNumber = await NumberModel.findOne({}).sort({ expires: -1 });
    if (!currentNumber) {
      console.log("No number found.");
      return true; // No number found in DB
    } else {
      const numberCreated = currentNumber.created;

      const twentyFourHours = 24 * 60 * 60 * 1000;

      const isExpired = Date.now() - numberCreated >= twentyFourHours;

      console.log("Number expired:", isExpired);

      return isExpired
    }
  };

  if (await checkExpired()) {
    try {
      const numberDocuments = difficulties.map((difficulty) => ({
        difficulty: difficulty.name,
        max: difficulty.max,
        value: randomNumber(difficulty.max),
        color: difficulty.color,
        attempts: difficulty.attempts,
        expires: Date.now() + 24 * 60 * 60 * 1000, // Adds 24 hours to the current date
        global_user_guesses: 0,
      }));

      // Use insertMany to reduce the number of individual operations
      const createdNumbers = await NumberModel.insertMany(numberDocuments);

      res.status(200).json(createdNumbers);
      return
    } catch (error) {
      console.error("Error creating numbers:", error); // For debugging
      res.status(500).json({
        message: "Error creating number",
        error: (error as Error).message,
      });
    }
  } else {
    return res.status(300).json({
      message: "The number hasn't expired yet.",
    });
  }
};

cron.schedule('0 4 * * *', async () => {
  console.log("Running scheduled task to create numbers...")
  try {
    const req = {} as Request
    const res = {
      status: (statusCode: number) => ({
        json: (message: any) => console.log(message)
      }),

    } as Response;

    await createNumberController(req, res)
  } catch(error){
    console.error('Error running scheduled task: ', error)
  }
})

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
    const numbers = await NumberModel.find({}).sort({ expires: -1 }).limit(4);
    res.status(200).json(numbers);
  } catch (error) {
    res.status(400).json({ ok: "no", error: (error as Error).message });
  }
};

export { createNumberController, getAllNumbers, getCurrentNumbers };
