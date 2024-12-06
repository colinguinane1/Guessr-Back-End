import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const User = require("../types/types");
import dotenv from "dotenv";
dotenv.config();

// Secret key (should be stored in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

declare global {
  namespace Express {
    interface Request {
      user?: typeof User;
    }
  }
}

// Middleware to verify the token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");
  console.log("Auth header:", authHeader); // Debug log

  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    res.status(403).json({ message: "Access denied, no token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err); // Debug log
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
