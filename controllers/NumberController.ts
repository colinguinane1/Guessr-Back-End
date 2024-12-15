import { Request, Response } from "express";
import cron from "node-cron";
import User from "../models/UserModel";
const NumberModel = require(`../models/NumberModel`);

const difficulties = [
  { name: "easy", max: 10, attempts: 4, color: "green" },
  { name: "medium", max: 200, attempts: 8, color: "yellow" },
  { name: "hard", max: 1500, attempts: 15, color: "orange" },
  { name: "impossible", max: 10000, attempts: 25, color: "red" },
];

const randomNumber = (max: number) => {
  return Math.floor(Math.random() * max) + 1;
};

const addNumberGuess = async (req: Request, res: Response) => {
  const { numberId } = req.body;
  const number = await NumberModel.findById(numberId);
  if (!number) return res.status(404).json({ message: "Number not found" });
  number.global_user_guesses++;
  await number.save();
  res.status(200).json(number);
};

const addCorrectGuess = async (req: Request, res: Response) => {
  const { numberId, user } = req.body;
  if (!numberId || !user) {
    return res.status(400).json({ message: "Missing numberId or user." });
  }
  const number = await NumberModel.findById(numberId);
  if (!number) return res.status(404).json({ message: "Number not found" });
  number.correct_user_guesses++;
  if (user) {
    if (number.correct_users.includes(user)) {
      return res.status(400).json({ message: "User already guessed" });
    }
    const userProfile = await User.findById(user._id);
    if (userProfile) {
      userProfile.xp += 100;
      await userProfile.save();
      console.log("Added 100 XP to user: " + userProfile.username);
    }
    number.correct_users.push(user._id);
  }
  await number.save();
  res.status(200).json(number);
};

const createNumber = async (req: Request, res: Response) => {
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
    return;
  } catch (error) {
    console.error("Error creating numbers:", error); // For debugging
    res.status(500).json({
      message: "Error creating number",
      error: (error as Error).message,
    });
  }
};

cron.schedule("0 0 * * *", async () => {
  const production = process.env.NODE_ENV === "production";
  if (!production) {
    console.log("Not running scheduled task in development mode.");
    return;
  }
  console.log("Running scheduled task to create numbers...");
  try {
    const req = {} as Request;
    const res = {
      status: (statusCode: number) => ({
        json: (message: any) => console.log(message),
      }),
    } as Response;

    await createNumber(req, res);
  } catch (error) {
    console.error("Error running scheduled task: ", error);
  }
});

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

export {
  createNumber,
  addNumberGuess,
  addCorrectGuess,
  getAllNumbers,
  getCurrentNumbers,
};
