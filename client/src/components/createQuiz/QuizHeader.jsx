import { Link } from "react-router-dom"; // 🔁 Import Link for navigation

// QuizHeader component: Displays the header bar with the quiz logo
function QuizHeader() {
  return (
    // Container div with background color, padding, and horizontal alignment
    <div
      style={{ backgroundColor: "#19444a" }}
      className="d-flex align-items-center p-1 shadow"
    >
      {/* Clickable Logo image wrapped in a Link to home */}
      <Link to="/">
        <img
          src="/quiz_logo.png"
          style={{ width: "150px", cursor: "pointer" }}
          alt="Quiz Logo"
        />
      </Link>
    </div>
  );
}

export default QuizHeader;
