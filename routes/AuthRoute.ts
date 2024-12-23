import express from "express";
import {
  getUser,
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
} from "../controllers/AuthController";
import { authenticateToken } from "../middleware/middleware";

const router = express.Router();

router.get("/user", authenticateToken, getUser);
router.get("/all-users", getAllUsers);
router.get("/profile/:username", getProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
