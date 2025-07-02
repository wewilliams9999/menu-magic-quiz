
import { toast } from "sonner";

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Record<string, any>;
  locationMode: boolean;
  setCurrentScreen: (screen: "location" | "quiz" | "result") => void;
  setCurrentQuestionIndex: (index: number | ((prev: number) => number)) => void;
  error: any;
}

export const useQuizNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  answers,
  locationMode,
  setCurrentScreen,
  setCurrentQuestionIndex,
  error,
}: QuizNavigationProps) => {
  const handleNextQuestion = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      // Move to results screen
      console.log("Moving to results screen with answers:", answers);
      setCurrentScreen("result");
      
      // Show notification if there was an API error
      if (error) {
        toast.error("Could not fetch restaurant data. Showing fallback recommendations instead.");
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      // Go back to location screen if we're at the first question
      setCurrentScreen("location");
    }
  };

  return {
    handleNextQuestion,
    handlePreviousQuestion,
  };
};
