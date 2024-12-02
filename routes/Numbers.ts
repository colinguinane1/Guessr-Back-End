const express = require("express");
const router = express.Router();

import {
  createNumberController,
  getAllNumbers,
  getCurrentNumbers,
} from "../controllers/NumberController";

// Define your routes here
// router.get("/", (req: Request, res: Response) => {
//   res.json({
//     easy: { min: 1, max: 10, number: 5, attempts: 3 },
//     medium: { min: 1, max: 200, number: 162, attempts: 8 },
//     hard: { min: 1, max: 1500, number: 633, attempts: 14 },
//     impossible: { min: 1, max: 10000, number: 6512, attempts: 25 },
//   });
// });

router.post("/create", createNumberController)

router.get("/all", getAllNumbers);

router.get("/current", getCurrentNumbers);

// Export the router
module.exports = router
