import express, { Request, Response } from "express";
// import {body, validationResult} from "express-validator";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/middleware";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}

router.get("/", (req: Request, res: Response) => {
  res.send("Auth routes");
});

router.get(
  "/user",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Received registration request:", { email, password });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User exists:", email);
      res.status(400).json({ message: "User exists" });
      return;
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({ token, user: { email: user.email, userId: user._id } });
    return;
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
    return;
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

module.exports = router;
