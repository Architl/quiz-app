// Import components used for creating a quiz
import QuizForm from "../components/createQuiz/QuizForm";
import QuizHeader from "../components/createQuiz/QuizHeader";

// Main page component for quiz creation
function CreateQuiz() {
  return (
    <div>
      {/* Header section for quiz creation page */}
      <QuizHeader />

      {/* Form component to create a new quiz */}
      <QuizForm />
    </div>
  );
}

export default CreateQuiz;
