const express = require("express");
const router = express.Router();

import {
  createNumber,
  getAllNumbers,
  getCurrentNumbers,
  addCorrectGuess,
  addNumberGuess,
} from "../controllers/NumberController";

router.post("/add-guess", addNumberGuess);
router.post("/correct-guess", addCorrectGuess);
router.post("/create", createNumber);
router.get("/all", getAllNumbers);
router.get("/current", getCurrentNumbers);

// Export the router
module.exports = router;
