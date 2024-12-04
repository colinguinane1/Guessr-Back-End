import express, { Request, Response } from "express";
// import {body, validationResult} from "express-validator";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Auth routes");
});

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    console.log("here ");
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User exists" });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    console.log(token);
    console.log(user._id);
    console.log(user.name);
    console.log(user.email);

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

module.exports = router;
