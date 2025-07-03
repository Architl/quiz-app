// Import required dependencies and components
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Nav from "../components/navbar";
import Category from "../components/Category";

function CategoryPage() {
  // Extract category name from URL parameters
  const { categoryName } = useParams();

  // State to store quizzes and loading status
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Router navigation and auth context
  const navigate = useNavigate();
  const { user, setShowAuthPrompt } = useAuth();

  // Fetch quizzes whenever category name or user changes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true); // Show loading spinner

      try {
        // Handle "my-quizzes" special route
        if (categoryName === "my-quizzes") {
          // Prompt login if user not authenticated
          if (!user) {
            setShowAuthPrompt(true);
            return;
          }

          // Fetch all quizzes and filter by current user's ID
          const token = localStorage.getItem("token");
          const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const myQuizzes = data.quizzes.filter(
            (quiz) => quiz.createdBy?._id === user._id
          );
          setQuizzes(myQuizzes);
        } else {
          // For any other category, encode the name and fetch quizzes
          const encodedCategory = encodeURIComponent(categoryName);
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/quiz?category=${encodedCategory}`
          );
          setQuizzes(data.quizzes || data); // Support both response formats
        }
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    fetchQuizzes();
  }, [categoryName, user]);

  // Navigate to quiz attempt page or prompt login if not authenticated
  const handleQuizClick = (id) => {
    if (!localStorage.getItem("token")) {
      setShowAuthPrompt(true);
    } else {
      navigate(`/quiz/${id}`);
    }
  };

  return (
    <>
      {/* Navbar and category icons */}
      <Nav />
      <Category />

      {/* Quiz content area */}
      <div className="quiz-display-container container mt-4">
        {/* Dynamic heading based on category */}
        <h2 className="section-title text-capitalize mb-4">
          {categoryName === "my-quizzes"
            ? "My Quizzes"
            : `${categoryName.replace("-", " ")} Quizzes`}
        </h2>

        {/* Show loader or quiz grid or message */}
        {loading ? (
          <div className="mt-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="quiz-grid">
            {/* Render each quiz card */}
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="quiz-card"
                onClick={() => handleQuizClick(quiz._id)}
              >
                <div className="quiz-image-wrapper">
                  <img
                    src={quiz.image}
                    alt={quiz.name}
                    className="quiz-image"
                  />
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
            ))}
          </div>
        ) : (
          // Fallback message if no quizzes found
          <p className="text-center">No quizzes available in this category.</p>
        )}
      </div>
    </>
  );
}

export default CategoryPage;
