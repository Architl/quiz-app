import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Component that displays a card prompting the user to create a quiz
function CreateQuizCard() {
  const navigate = useNavigate();
  const { setShowAuthPrompt } = useAuth();

  // Function to check if user is logged in by checking for token in localStorage
  const isLoggedIn = () => !!localStorage.getItem("token");

  // Handle click on the "Quiz Editor" button
  const handleCreateClick = () => {
    if (!isLoggedIn()) {
      setShowAuthPrompt(true); // Prompt login/signup if not logged in
    } else {
      navigate('/create-quiz'); // Navigate to quiz creation page
    }
  };

  return (
    // Card container with background, padding, spacing, and alignment
    <div
      style={{ backgroundColor: '#19444a' }}
      className="border m-3 rounded d-flex justify-content-center align-items-center gap-3 p-3"
    >
      {/* Left side image shown only on medium and larger screens */}
      <div className="d-none d-md-block">
        <img src='/create.png' style={{ width: '250px' }} />
      </div>

      {/* Right side content: title, subtitle, and button */}
      <div className='text-center'>
        <h1 style={{ fontWeight: 'bold', color: 'white', fontFamily: 'cursive' }}>
          Create a Quiz
        </h1>
        <h3 style={{ color: 'white', fontFamily: 'cursive' }}>
          Play For Free
        </h3>

        {/* Button that either navigates to editor or shows auth prompt */}
        <button
          onClick={handleCreateClick}
          style={{ backgroundColor: 'darkgreen', color: 'white', borderRadius: '20px' }}
          className="fw-bold pt-2 pb-2 ps-5 pe-5 me-2 shadow"
        >
          Quiz Editor
        </button>
      </div>
    </div>
  );
}

export default CreateQuizCard;
