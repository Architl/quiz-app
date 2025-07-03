import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// QuestionSlide component: Renders a single question with its options and handles updates
const QuestionSlide = ({ data, index, onUpdate }) => {
  // Handler to update the question text
  const handleQuestionChange = (e) => {
    onUpdate(index, { ...data, question: e.target.value });
  };

  // Handler to update the text of a specific option
  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...data.options];
    newOptions[optIndex] = value;
    onUpdate(index, { ...data, options: newOptions });
  };

  // Handler to toggle whether an option is marked as a correct answer
  const toggleCorrect = (optIndex) => {
    let newCorrectAnswers = [...data.correctAnswers];

    // If the option is already marked correct, remove it; else, add it
    if (newCorrectAnswers.includes(optIndex)) {
      newCorrectAnswers = newCorrectAnswers.filter((i) => i !== optIndex);
    } else {
      newCorrectAnswers.push(optIndex);
    }

    // Update the parent component with the new correct answers array
    onUpdate(index, { ...data, correctAnswers: newCorrectAnswers });
  };

  return (
    <div style={{ fontFamily: "cursive" }}>
      {/* Display question number */}
      <h4 style={{ color: "white" }}>Question {index + 1}</h4>

      {/* Textarea for the question input */}
      <textarea
        maxlength="120"
        type="text"
        placeholder="Enter question"
        className="form-control mb-3"
        value={data.question}
        onChange={handleQuestionChange}
      />

      {/* Render each option input with a toggle button for correct answer */}
      {data.options.map((option, optIndex) => (
        <div key={optIndex} className="d-flex align-items-center mb-2">
          {/* Input for option text */}
          <input
            maxlength="75"
            type="text"
            placeholder={`Option ${optIndex + 1}`}
            className="form-control me-2"
            value={option}
            onChange={(e) => handleOptionChange(optIndex, e.target.value)}
            required={optIndex < 2} // Ensure at least 2 options are required
          />

          {/* Toggle button to mark/unmark this option as correct */}
          <button
            type="button"
            className={`btn ${
              data.correctAnswers.includes(optIndex)
                ? "btn-success"
                : "btn-danger"
            }`}
            onClick={() => toggleCorrect(optIndex)}
          >
            {data.correctAnswers.includes(optIndex) ? "✓" : "✘"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuestionSlide;
