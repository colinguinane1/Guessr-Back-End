const express = require("express");
import { Request, Response } from "express";
const router = express.Router();

// Define your routes here
router.get("/", (req: Request, res: Response) => {
  res.json({ easy: 5, medium: 25, hard: 124, impossible: 51250 });
});

// Export the router
module.exports = router;
