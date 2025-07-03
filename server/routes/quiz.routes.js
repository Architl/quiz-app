import express from "express";
import {
  addQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
  submitQuiz,
  getLeaderboard,
} from "../controllers/quiz.controller.js";

import auth from "../middleware/auth.middleware.js"; // Middleware to protect routes
import upload from "../middleware/upload.middleware.js"; // Handles image upload to Cloudinary

const router = express.Router();

// Create a new quiz (requires auth and optional image upload)
router.post("/", auth, upload.single("image"), addQuiz);

// Get all quizzes or filter by category (public)
router.get("/", getAllQuizzes);

// Submit quiz answers (requires auth)
router.post("/submit", auth, submitQuiz);

// Get leaderboard for a specific quiz
router.get("/:quizId/leaderboard", getLeaderboard);

// Get a specific quiz by ID (public)
router.get("/:id", getQuizById);

// Delete a quiz by ID (only creator can delete)
router.delete("/:id", auth, deleteQuiz);

export default router;
