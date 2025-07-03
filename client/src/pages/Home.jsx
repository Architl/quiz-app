import React from "react";

// Import layout and feature components for homepage
import Nav from "../components/navbar";
import QuizDisplay from "../components/QuizDisplay";
import CreateQuizCard from "../components/CreateQuizCard";
import Category from "../components/Category";

function Home() {
  return (
    <>
      {/* Navigation bar visible on homepage */}
      <Nav />

      {/* Horizontal category icon section */}
      <Category />

      {/* Card to create a new quiz */}
      <CreateQuizCard />

      {/* Displays My Quizzes, Recently Added, and Category-wise quizzes */}
      <QuizDisplay />
    </>
  );
}

export default Home;
