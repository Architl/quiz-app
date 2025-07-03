// Import necessary modules and hooks
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/QuizDisplay.css"; // Custom styles for quiz display
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext"; // Auth context for user and modal control

function QuizDisplay() {
  // State variables
  const [quizzes, setQuizzes] = useState([]); // All quizzes
  const [categoryQuizzes, setCategoryQuizzes] = useState({}); // Grouped by category
  const [myQuizzes, setMyQuizzes] = useState([]); // Quizzes created by current user
  const navigate = useNavigate();
  const { setShowAuthPrompt, user } = useAuth(); // Auth context access
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch quizzes on mount and when user state changes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz`);
        setQuizzes(data.quizzes);
        setCategoryQuizzes(groupByCategory(data.quizzes));

        // Filter quizzes created by the current user
        if (user) {
          setMyQuizzes(
            data.quizzes.filter((quiz) => quiz.createdBy?._id === user._id)
          );
        }
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      } finally {
        // Add delay if user is not yet loaded
        if (!user) {
          setTimeout(() => setLoading(false), 200);
        } else {
          setLoading(false);
        }
      }
    };

    fetchQuizzes();
  }, [user]);

  // Group quizzes by their category
  const groupByCategory = (quizzes) => {
    const grouped = {};
    quizzes.forEach((quiz) => {
      const category = quiz.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(quiz);
    });
    return grouped;
  };

  // Check if user is logged in by verifying token
  const isLoggedIn = () => !!localStorage.getItem("token");

  // Navigate to quiz page or show login prompt
  const handleQuizClick = (quizId) => {
    if (!isLoggedIn()) {
      setShowAuthPrompt(true); // Prompt login if user not authenticated
    } else {
      navigate(`/quiz/${quizId}`);
    }
  };

  // Handle quiz deletion with confirmation
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove quiz from all related states after deletion
        setMyQuizzes(myQuizzes.filter((quiz) => quiz._id !== quizId));
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
        setCategoryQuizzes(
          groupByCategory(quizzes.filter((quiz) => quiz._id !== quizId))
        );
        alert("Quiz deleted successfully");
      } catch (err) {
        console.error("Failed to delete quiz:", err);
        alert(err.response?.data?.error || "Failed to delete quiz");
      }
    }
  };

  // Render a quiz card that includes delete button (only for My Quizzes)
  const renderMyQuizCard = (quiz) => (
    <div
      key={quiz._id}
      className="quiz-card"
      style={{ position: "relative" }}
      onClick={() => handleQuizClick(quiz._id)}
    >
      <div className="quiz-image-wrapper">
        <img src={quiz.image} alt={quiz.name} className="quiz-image" />
        <div className="hover-overlay">
          <button
            className="play-button"
            onClick={() => handleQuizClick(quiz._id)}
          >
            Play
          </button>
        </div>
      </div>
      <h5 className="quiz-title">{quiz.name}</h5>
      {quiz.createdBy?.name && (
        <p
          className="creator-name text-muted"
          style={{ fontSize: "0.85rem", marginTop: "-8px" }}
        >
          by {quiz.createdBy.name}
        </p>
      )}
      {/* Delete button */}
      <button
        className="btn btn-danger btn-sm"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "2px 8px",
        }}
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          handleDeleteQuiz(quiz._id);
        }}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );

  // Render a quiz card (without delete button)
  const renderQuizCard = (quiz) => (
    <div
      key={quiz._id}
      className="quiz-card"
      onClick={() => handleQuizClick(quiz._id)}
    >
      <div className="quiz-image-wrapper">
        <img src={quiz.image} alt={quiz.name} className="quiz-image" />
        <div className="hover-overlay">
          <button className="play-button">Play</button>
        </div>
      </div>
      <h5 className="quiz-title">{quiz.name}</h5>
      {quiz.createdBy?.name && (
        <p
          className="creator-name text-muted"
          style={{ fontSize: "0.85rem", marginTop: "-8px" }}
        >
          by {quiz.createdBy.name}
        </p>
      )}
    </div>
  );

  // Show loading spinner until quizzes are fetched
  if (loading) {
    return (
      <div className="quiz-display-container text-center">
        <div className="spinner-border text-primary mt-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-display-container">
      {/* === My Quizzes Section === */}
      {user && myQuizzes.length > 0 && (
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="section-title">My Quizzes</h2>
            <button
              className="btn btn-link"
              onClick={() => navigate("/category/my-quizzes")}
            >
              See All →
            </button>
          </div>
          <div className="quiz-grid">
            {myQuizzes.slice(0, 4).map(renderMyQuizCard)}
          </div>
        </div>
      )}

      {/* === Recently Added Quizzes Section === */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="section-title">Recently Added</h2>
        </div>
        <div className="quiz-grid">
          {quizzes.slice(0, 4).map(renderQuizCard)}
        </div>
      </div>

      {/* === Category-wise Quiz Sections === */}
      {Object.entries(categoryQuizzes).map(([category, items]) => (
        <div key={category} className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="section-title">{category}</h2>
            <button
              className="btn btn-link"
              onClick={() => navigate(`/category/${category}`)}
            >
              See All →
            </button>
          </div>
          <div className="quiz-grid">
            {items.slice(0, 4).map(renderQuizCard)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuizDisplay;
