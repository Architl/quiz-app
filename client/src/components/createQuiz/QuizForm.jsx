import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QuestionSlide from "./QuestionSlide";

// Main QuizForm component for creating a quiz
const QuizForm = () => {
  // State to hold quiz-level information
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    description: "",
    language: "",
    category: "",
    image: null,
  });

  const navigate = useNavigate();

  // Flag to trigger movement to a newly added slide
  const [slideAdded, setSlideAdded] = useState(false);

  // State to hold all slides (each containing a question)
  const [slides, setSlides] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswers: [],
    },
  ]);

  // Current slide index (0 means quiz details)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Add a new slide after validating the current one
  const addSlide = () => {
    const current = slides[currentSlide - 1];

    if (!current.question.trim()) {
      alert("Question is required.");
      return;
    }

    if (!current.options[0].trim() || !current.options[1].trim()) {
      alert("At least two options are required.");
      return;
    }

    if (current.correctAnswers.length === 0) {
      alert("Select at least one correct answer.");
      return;
    }

    // Add an empty slide
    const newSlide = {
      question: "",
      options: ["", "", "", ""],
      correctAnswers: [],
    };

    setSlides([...slides, newSlide]);
    setSlideAdded(true); // trigger useEffect to move to the new slide
  };

  // Update a specific slide with new data
  const updateSlide = (index, updatedSlide) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = updatedSlide;
    setSlides(updatedSlides);
  };

  // Automatically navigate to new slide when added
  useEffect(() => {
    if (slideAdded) {
      setCurrentSlide(slides.length); // move to the latest slide
      setSlideAdded(false); // reset flag
    }
  }, [slideAdded, slides.length]);

  // Handles logic when Next button is clicked
  const handleNext = () => {
    if (currentSlide === 0) {
      // Validate quiz details
      const { title, description, language, category } = quizInfo;
      if (!title || !description || !language || !category) {
        alert("Please fill all quiz details before continuing.");
        return;
      }
    } else {
      // Validate current slide before proceeding
      const current = slides[currentSlide - 1];
      if (!current.question.trim()) {
        alert("Question is required.");
        return;
      }
      if (!current.options[0].trim() || !current.options[1].trim()) {
        alert("At least two options are required.");
        return;
      }
      if (current.correctAnswers.length === 0) {
        alert("Select at least one correct answer.");
        return;
      }
    }

    setCurrentSlide((prev) => prev + 1); // move to next slide
    setSlideAdded(false); // allow Add Slide to work again
  };

  // Delete a specific slide
  const deleteSlide = (index) => {
    const updatedSlides = [...slides];
    updatedSlides.splice(index, 1); // remove selected slide
    setSlides(updatedSlides);

    // Adjust currentSlide if deleted the last one
    if (currentSlide > updatedSlides.length) {
      setCurrentSlide(updatedSlides.length);
    }
  };

  // Handle quiz form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all slides before submission
    const allValid = slides.every(
      (slide) =>
        slide.question.trim() &&
        slide.options[0].trim() &&
        slide.options[1].trim() &&
        slide.correctAnswers.length > 0
    );

    if (!allValid) {
      alert("Make sure all slides are correctly filled.");
      return;
    }

    // Prepare form data for submission (multipart)
    const formData = new FormData();
    formData.append("name", quizInfo.title); // backend expects 'name'
    formData.append("description", quizInfo.description);
    formData.append("language", quizInfo.language);
    formData.append("category", quizInfo.category);
    if (quizInfo.image) {
      formData.append("image", quizInfo.image); // optional image
    }

    // Format questions for backend
    const formattedSlides = slides.map((slide) => {
      const options = slide.options
        .map((text, idx) => ({
          text: text.trim(),
          isCorrect: slide.correctAnswers.includes(idx),
        }))
        .filter((opt) => opt.text); // only keep non-empty options

      return {
        questionText: slide.question.trim(),
        type:
          options.filter((opt) => opt.isCorrect).length > 1
            ? "multiple"
            : "single",
        options,
      };
    });

    formData.append("questions", JSON.stringify(formattedSlides));

    try {
      const token = localStorage.getItem("token");

      // Send form data to backend
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/quiz`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Quiz submitted successfully!");

      // Navigate to home after short delay
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit quiz");
    }
  };

  return (
    <div
      style={{ fontFamily: "cursive" }}
      className="d-flex justify-content-center"
    >
      <form
        style={{ backgroundColor: "#574a62" }}
        onSubmit={handleSubmit}
        className="d-flex justify-content-center col-6 p-4 m-4 rounded"
      >
        <div style={{ width: "100%" }}>
          {/* If on slide 0, show quiz detail form; else show question form */}
          {currentSlide === 0 ? (
            <div>
              <h3 style={{ fontFamily: "cursive", color: "white" }}>
                Quiz Details
              </h3>

              {/* Input: Title */}
              <div>
                <input
                  maxlength="75"
                  className="form-control mb-3"
                  required
                  placeholder="Title"
                  value={quizInfo.title}
                  onChange={(e) =>
                    setQuizInfo({ ...quizInfo, title: e.target.value })
                  }
                />
              </div>

              {/* Input: Description */}
              <div>
                <textarea
                  maxlength="250"
                  className="form-control mb-3"
                  required
                  placeholder="Description"
                  value={quizInfo.description}
                  onChange={(e) =>
                    setQuizInfo({ ...quizInfo, description: e.target.value })
                  }
                />
              </div>

              {/* Input: Language */}
              <div>
                <input
                  maxlength="50"
                  className="form-control mb-3"
                  required
                  placeholder="Language"
                  value={quizInfo.language}
                  onChange={(e) =>
                    setQuizInfo({ ...quizInfo, language: e.target.value })
                  }
                />
              </div>

              {/* Dropdown: Category */}
              <div>
                <select
                  className="form-control mb-3"
                  required
                  value={quizInfo.category}
                  onChange={(e) =>
                    setQuizInfo({ ...quizInfo, category: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Category
                  </option>
                  <option value="Art & Literature">Art & Literature</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Geography">Geography</option>
                  <option value="History">History</option>
                  <option value="Sports">Sports</option>
                  <option value="Science & Nature">Science & Nature</option>
                </select>
              </div>

              {/* Image Upload (Optional) */}
              <div>
                <label>Upload Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setQuizInfo({ ...quizInfo, image: e.target.files[0] })
                  }
                />
              </div>
            </div>
          ) : (
            // Show the current question slide component
            <QuestionSlide
              data={slides[currentSlide - 1]}
              index={currentSlide - 1}
              onUpdate={updateSlide}
            />
          )}

          {/* Navigation Buttons */}
          <div>
            {currentSlide > 0 && (
              <button
                className="form-control"
                type="button"
                onClick={() => setCurrentSlide(currentSlide - 1)}
              >
                Previous
              </button>
            )}

            {currentSlide < slides.length ? (
              <button
                className="form-control mt-2"
                type="button"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button className="form-control mt-2" type="submit">
                Submit Quiz
              </button>
            )}
          </div>

          {/* Show Add Slide button only on the last slide */}
          {currentSlide > 0 &&
            currentSlide === slides.length &&
            !slideAdded && (
              <div>
                <button
                  className="form-control mt-2 btn btn-secondary"
                  type="button"
                  onClick={addSlide}
                >
                  Add Slide
                </button>
              </div>
            )}

          {/* Show Delete Slide only if more than 1 slide */}
          {currentSlide > 1 && slides.length > 1 && (
            <div>
              <button
                className="form-control mt-2 btn btn-danger"
                type="button"
                onClick={() => deleteSlide(currentSlide - 1)}
              >
                Delete This Slide
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
