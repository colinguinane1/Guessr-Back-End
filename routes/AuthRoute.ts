import express from "express";
import {
  getUser,
  registerUser,
  loginUser,
} from "../controllers/AuthController";
import { authenticateToken } from "../middleware/middleware";

const router = express.Router();

router.get("/user", authenticateToken, getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
