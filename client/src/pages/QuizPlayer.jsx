import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import axios from "axios";
import QuizHeader from "../components/createQuiz/QuizHeader";

function QuizPlayer() {
  const { id } = useParams(); // Get quiz ID from route parameters
  const navigate = useNavigate();

  // State variables
  const [quiz, setQuiz] = useState(null); // Quiz data
  const [currentQuestion, setCurrentQuestion] = useState(0); // Current question index
  const [userAnswers, setUserAnswers] = useState({}); // User-selected answers
  const [showResult, setShowResult] = useState(false); // Result view toggle
  const [score, setScore] = useState(0); // Final score

  // Fetch quiz data by ID when component mounts or ID changes
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/${id}`);
        setQuiz(data.quiz);
      } catch (error) {
        console.error("Failed to load quiz:", error);
      }
    };

    fetchQuiz();
  }, [id]);

  // Handle option selection (single or multiple choice)
  const handleOptionToggle = (questionIndex, optionIndex) => {
    const current = quiz.questions[questionIndex];
    const isMultiple = current.type === "multiple";

    setUserAnswers((prev) => {
      const existing = prev[questionIndex] || [];
      let updated;

      if (isMultiple) {
        // Toggle selection if multiple options allowed
        updated = existing.includes(optionIndex)
          ? existing.filter((i) => i !== optionIndex)
          : [...existing, optionIndex];
      } else {
        // Replace selection if only one option allowed
        updated = [optionIndex];
      }

      return {
        ...prev,
        [questionIndex]: updated,
      };
    });
  };

  // Move to next question or finish the quiz
  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateScore();
      setShowResult(true);
    }
  };

  // Calculate final score and submit quiz to backend
  const calculateScore = async () => {
    let total = 0;

    quiz.questions.forEach((question, index) => {
      // Get all correct option indices
      const correctIndexes = question.options
        .map((opt, i) => (opt.isCorrect ? i : null))
        .filter((i) => i !== null);

      const userSelection = userAnswers[index] || [];

      // Check if user's answer matches all correct options exactly
      const isCorrect =
        correctIndexes.length === userSelection.length &&
        correctIndexes.every((i) => userSelection.includes(i));

      if (isCorrect) total += 1;
    });

    setScore(total); // Set calculated score

    try {
      // Submit answers and score to server
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/quiz/submit`,
        {
          quizId: quiz._id,
          userAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  // Show loading message while quiz is being fetched
  if (!quiz) return <div className="text-center mt-5">Loading quiz...</div>;

  // Show results screen after submission
  if (showResult) {
    return (
      <>
        <QuizHeader />
        <div className="container mt-5" style={{ fontFamily: "cursive" }}>
          <h2 className="text-center">{quiz.name} - Results</h2>
          <p className="text-center">
            You scored {score} out of {quiz.questions.length}
          </p>

          {/* 👇 Display leaderboard after quiz completion */}
          <Leaderboard quizId={quiz._id} />

          {/* Back to Home button */}
          <div className="text-center">
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // Get current question to render
  const question = quiz.questions[currentQuestion];

  return (
    <>
      <QuizHeader />
      <div style={{ fontFamily: "cursive" }} className="container mt-4">
        {/* Quiz title and description */}
        <h2>{quiz.name}</h2>
        <p>{quiz.description}</p>
        <hr />

        {/* Display current question and its options */}
        <div>
          <h4>
            Q{currentQuestion + 1}: {question.questionText}
          </h4>

          {/* Render multiple or single choice options */}
          {question.type === "multiple" ? (
            <div>
              {question.options.map((opt, index) => (
                <div className="form-check" key={index}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`q${currentQuestion}-opt${index}`}
                    checked={(userAnswers[currentQuestion] || []).includes(
                      index
                    )}
                    onChange={() => handleOptionToggle(currentQuestion, index)}
                  />
                  <label
                    className="form-check-label mb-2"
                    htmlFor={`q${currentQuestion}-opt${index}`}
                  >
                    {opt.text}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <ul className="list-group">
              {question.options.map((opt, index) => (
                <li
                  key={index}
                  className={`list-group-item ${
                    (userAnswers[currentQuestion] || []).includes(index)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleOptionToggle(currentQuestion, index)}
                  style={{ cursor: "pointer" }}
                >
                  {opt.text}
                </li>
              ))}
            </ul>
          )}

          {/* Navigation buttons */}
          <div className="d-flex justify-content-between mt-4">
            {currentQuestion > 0 && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
              >
                Previous
              </button>
            )}
            <button className="btn btn-success ms-auto" onClick={handleNext}>
              {currentQuestion === quiz.questions.length - 1
                ? "Submit Quiz"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizPlayer;
