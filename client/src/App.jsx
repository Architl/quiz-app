import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateQuiz from "./pages/CreateQuiz";
import Home from "./pages/Home";
import QuizPlayer from "./pages/QuizPlayer";
import { AuthProvider } from "./context/AuthContext";
import CategoryPage from "./pages/CategoryPage";
import Footer from "./components/Footer";

function App() {
  return (
    // Provide global auth context to the entire app
    <AuthProvider>
      {/* Set up React Router */}
      <Router>
        {/* Main app wrapper with full height to allow sticky footer */}
        <div className="app-wrapper d-flex flex-column min-vh-100">
          {/* Define routes for different pages */}
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page */}
            <Route path="/create-quiz" element={<CreateQuiz />} />{" "}
            {/* Quiz creation page */}
            <Route path="/quiz/:id" element={<QuizPlayer />} />{" "}
            {/* Quiz player page by ID */}
            <Route
              path="/category/:categoryName"
              element={<CategoryPage />}
            />{" "}
            {/* Dynamic category page */}
          </Routes>

          {/* Common footer shown on all pages */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
