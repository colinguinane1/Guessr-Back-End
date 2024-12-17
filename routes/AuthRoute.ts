import express from "express";
import {
  getUser,
  registerUser,
  loginUser,
  getProfile,
  addProfileView,
  getAllUsers,
} from "../controllers/AuthController";
import { authenticateToken } from "../middleware/middleware";

const router = express.Router();

router.get("/user", authenticateToken, getUser);
router.get("/all-users", getAllUsers);
router.get("/profile/:id", getProfile);
router.post("/profile/:id" , addProfileView);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
