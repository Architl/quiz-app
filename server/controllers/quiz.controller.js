import Quiz from "../models/quiz.js";
import QuizResult from "../models/quizResult.js";
import mongoose from "mongoose";

// ================== CREATE QUIZ ==================
export const addQuiz = async (req, res) => {
  try {
    const { name, description, language, category, questions } = req.body;

    // Use uploaded image or fallback to default
    const imagePath =
      req.file?.path ||
      "https://canopylab.io/wp-content/uploads/2020/05/Working-with-adaptive-quizzes-A-beginners-guide.jpg";

    // Parse questions string if needed
    const parsedQuestions =
      typeof questions === "string" ? JSON.parse(questions) : questions;

    // Assign question type: "single" or "multiple"
    const formattedQuestions = parsedQuestions.map((q) => {
      const correctOptions = q.options.filter((opt) => opt.isCorrect);
      const type = correctOptions.length > 1 ? "multiple" : "single";

      return {
        questionText: q.questionText,
        type,
        options: q.options,
      };
    });

    // Save the quiz
    const quiz = await Quiz.create({
      name,
      description,
      language,
      category,
      image: imagePath,
      questions: formattedQuestions,
      createdBy: req.user, // user ID from auth middleware
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ================== GET ALL QUIZZES (optionally filtered by category) ==================
export const getAllQuizzes = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category && category !== "my-quizzes") {
      filter.category = { $regex: `^${category}$`, $options: "i" }; // case-insensitive
    }

    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== GET QUIZ BY ID ==================
export const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.status(200).json({ quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== DELETE QUIZ (only by creator) ==================
export const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.user; // from auth middleware

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // Check ownership
    if (quiz.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this quiz" });
    }

    await quiz.deleteOne();

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== SUBMIT QUIZ & SAVE RESULT ==================
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, userAnswers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;

    quiz.questions.forEach((question, index) => {
      const correct = question.options
        .map((opt, i) => (opt.isCorrect ? i : null))
        .filter((i) => i !== null);

      const given = userAnswers[index] || [];

      const isCorrect =
        correct.length === given.length &&
        correct.every((i) => given.includes(i));

      if (isCorrect) score += 1;
    });

    // Store result
    await QuizResult.create({
      quiz: quizId,
      user: req.user,
      score,
      totalQuestions: quiz.questions.length,
    });

    res.status(200).json({ message: "Quiz submitted", score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== LEADERBOARD ==================
export const getLeaderboard = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const leaderboard = await QuizResult.aggregate([
      // Match only current quiz
      { $match: { quiz: new mongoose.Types.ObjectId(quizId) } },
      { $sort: { score: -1, attemptedAt: 1 } }, // high score + earliest time
      {
        $group: {
          _id: "$user", // group by user ID
          bestScore: { $first: "$score" },
          attemptedAt: { $first: "$attemptedAt" },
        },
      },
      {
        $lookup: {
          from: "users", // name must match collection in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          bestScore: 1,
          attemptedAt: 1,
        },
      },
      { $sort: { bestScore: -1, attemptedAt: 1 } }, // sort again after lookup
      { $limit: 10 }, // top 10
    ]);

    res.status(200).json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: err.message });
  }
};
