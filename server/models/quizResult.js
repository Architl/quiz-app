import mongoose from "mongoose";

// Schema to store results when a user attempts a quiz
const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who attempted the quiz
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz", // Reference to the quiz that was attempted
    required: true,
  },
  score: {
    type: Number,
    required: true, // Score the user got (number of correct answers)
  },
  totalQuestions: {
    type: Number,
    required: true, // Total number of questions in the quiz
  },
  attemptedAt: {
    type: Date,
    default: Date.now, // Timestamp of when the quiz was attempted
  },
});

// Export the model
export default mongoose.model("QuizResult", quizResultSchema);
