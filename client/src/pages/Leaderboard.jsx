import React, { useEffect, useState } from "react";
import axios from "axios";

// Leaderboard component to show top scores for a specific quiz
const Leaderboard = ({ quizId }) => {
  // State to store leaderboard entries
  const [leaders, setLeaders] = useState([]);

  // Fetch leaderboard data when quizId changes or on component mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Call backend API to get leaderboard for given quiz
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/${quizId}/leaderboard`);
        setLeaders(data.leaderboard); // Store in state
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  return (
    <div className="mt-4">
      {/* Leaderboard heading */}
      <h4>🏆 Leaderboard</h4>

      {/* Ordered list of leaderboard entries */}
      <ol className="list-group">
        {leaders.map((entry, i) => (
          <li
            className="list-group-item d-flex justify-content-between"
            key={i}
          >
            <span>{entry.name || "Anonymous"}</span>
            <span>{entry.bestScore}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
