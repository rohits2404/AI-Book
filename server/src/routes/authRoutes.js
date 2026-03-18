import express from "express";
import { getAllProfile, getProfile, login, register, updateProfile } from "../controllers/authController.js";
import { googleLogin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profiles", protect, getAllProfile);
router.get("/profile", protect, getProfile);
router.get("/profile/:id", protect, getProfile);
router.put("/profile/:id", protect, updateProfile);
router.post("/google", googleLogin);

export default router;
