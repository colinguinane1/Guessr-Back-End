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
  // The return type should be void
  // Extract token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Get token without 'Bearer'

  if (!token) {
    // If no token, send a response and terminate the request
    res.status(403).json({ message: "Access denied, no token provided" });
    return;
  }

  // Verify and decode the token
  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      // If token is invalid or expired, send a response and terminate the request
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach the decoded user information (e.g., user ID) to the request object
    req.user = decoded; // Assuming decoded token contains user information (e.g., user ID)

    // Pass control to the next middleware or route handler
    next();
  });
};
