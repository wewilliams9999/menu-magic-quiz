
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import WelcomeScreen from "./WelcomeScreen";
import QuizQuestion from "./QuizQuestion";
import ResultScreen from "./ResultScreen";
import { quizQuestions } from "@/utils/quizData";
import { useRestaurantData } from "@/hooks/useRestaurantData";

type AnswerValue = string | string[];

const QuizContainer = () => {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "quiz" | "result">("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  
  // Get neighborhoods as string array for the API
  const neighborhoods = answers.neighborhood && Array.isArray(answers.neighborhood) 
    ? answers.neighborhood 
    : (answers.neighborhood ? [answers.neighborhood as string] : []);
  
  // Get preferences as string array for the API
  const preferences = answers.preferences && Array.isArray(answers.preferences)
    ? answers.preferences
    : (answers.preferences ? [answers.preferences as string] : []);
  
  // Use the restaurant data hook
  const { data: restaurantResults, isLoading, error } = useRestaurantData({
    neighborhoods: neighborhoods,
    cuisine: answers.cuisine as string,
    price: answers.price as string,
    atmosphere: answers.atmosphere as string,
    preferences: preferences,
  });

  const handleStart = () => {
    setCurrentScreen("quiz");
  };

  const handleAnswer = (questionId: string, answerId: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      // Move to results screen
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
    }
  };

  const handleReset = () => {
    setCurrentScreen("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {currentScreen === "welcome" && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}

        {currentScreen === "quiz" && (
          <QuizQuestion
            key={`question-${currentQuestionIndex}`}
            question={quizQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            selectedAnswer={answers[quizQuestions[currentQuestionIndex].id] || null}
            currentIndex={currentQuestionIndex}
            totalQuestions={quizQuestions.length}
          />
        )}

        {currentScreen === "result" && (
          <ResultScreen 
            key="result" 
            results={restaurantResults || []} 
            onReset={handleReset}
            isLoading={isLoading} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizContainer;
