import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { classifyText, extractKeywords, generateBookContent, generateBookOutline, summarizeText } from "../controllers/aiController.js";

const router = express.Router();

//apply protect middleware to all routes
router.use(protect);

router.post("/generate-book-outline", generateBookOutline);
router.post("/generate-book-content", generateBookContent);

router.post("/summarize", summarizeText);
router.post("/keywords", extractKeywords);
router.post("/classify", classifyText);

export default router;
