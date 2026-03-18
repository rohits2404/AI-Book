import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { exportAsDocx, exportAsPdf } from "../controllers/exportController.js";

const router = express.Router();

router.get('/pdf/:id', protect, exportAsPdf);
router.get('/docx/:id', protect, exportAsDocx);

export default router;
