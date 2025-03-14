
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "./WelcomeScreen";
import QuizQuestion from "./QuizQuestion";
import ResultScreen from "./ResultScreen";
import { quizQuestions, getRecommendations, QuizResult } from "@/utils/quizData";

const QuizContainer = () => {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "quiz" | "result">("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult[]>([]);

  const handleStart = () => {
    setCurrentScreen("quiz");
  };

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      // Generate results
      const recommendations = getRecommendations(answers);
      setResults(recommendations);
      setCurrentScreen("result");
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
    setResults([]);
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
          <ResultScreen key="result" results={results} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizContainer;
