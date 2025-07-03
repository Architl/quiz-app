import mongoose from "mongoose";

// Schema for individual options inside a question
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, // Option must have text
  },
  isCorrect: {
    type: Boolean,
    default: false, // By default, an option is not marked correct
  },
});

// Schema for a quiz question
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true, // Question must have text
  },
  type: {
    type: String,
    enum: ["single", "multiple"], // Either single or multiple correct answers
    required: true,
  },
  options: {
    type: [optionSchema], // Array of options (using optionSchema)
    validate: [
      (arr) => arr.length >= 2,
      "At least two options required", // Minimum 2 options per question
    ],
  },
});

// Main Quiz schema
const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Quiz must have a name
    },
    description: {
      type: String,
    },
    category: {
      type: String, // Optional category field (e.g., Math, History)
    },
    language: {
      type: String, // Language the quiz is in
    },
    image: {
      type: String,
      default:
        "https://canopylab.io/wp-content/uploads/2023/01/Blog-Creating-multiple-choice-quizzes-with-the-CanopyLAB-Quiz-engine.jpg",
      // Default image used if none is provided
    },
    questions: {
      type: [questionSchema], // Array of questions
      required: true,
      validate: [
        (arr) => arr.length > 0,
        "At least one question is required", // A quiz must have at least one question
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the quiz
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
