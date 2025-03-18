
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import WelcomeScreen from "./WelcomeScreen";
import LocationSelectionScreen from "./LocationSelectionScreen";
import QuizQuestion from "./QuizQuestion";
import ResultScreen from "./ResultScreen";
import { quizQuestions } from "@/utils/quizData";
import { useRestaurantData } from "@/hooks/useRestaurantData";

type AnswerValue = string | string[] | number;

const QuizContainer = () => {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "location" | "quiz" | "result">("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [useLocation, setUseLocation] = useState(false);
  const [locationMode, setLocationMode] = useState(false);
  
  // Get neighborhoods as string array for the API
  const neighborhoods = answers.neighborhood && Array.isArray(answers.neighborhood) 
    ? answers.neighborhood 
    : (answers.neighborhood ? [answers.neighborhood as string] : []);
  
  // Get preferences as string array for the API
  const preferences = answers.preferences && Array.isArray(answers.preferences)
    ? answers.preferences
    : (answers.preferences ? [answers.preferences as string] : []);
  
  // Get distance value for location-based search
  const distance = typeof answers.distance === 'number' ? answers.distance : undefined;
  
  // Use the restaurant data hook
  const { data: restaurantResults, isLoading, error } = useRestaurantData({
    neighborhoods: neighborhoods,
    cuisine: answers.cuisine as string,
    price: answers.price as string,
    atmosphere: answers.atmosphere as string,
    preferences: preferences,
    distance: distance,
  });

  const handleStart = () => {
    setCurrentScreen("location");
  };

  const handleLocationMethod = (method: "manual" | "location") => {
    const isLocationBased = method === "location";
    setUseLocation(isLocationBased);
    setLocationMode(isLocationBased);
    
    // If location-based, set initial distance
    if (isLocationBased) {
      setAnswers((prev) => ({
        ...prev,
        distance: 5, // Default 5 mile radius
      }));
    }
    
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
    } else {
      // Go back to location selection if we're at the first question
      setCurrentScreen("location");
    }
  };

  const handleReset = () => {
    setCurrentScreen("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setUseLocation(false);
    setLocationMode(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {currentScreen === "welcome" && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}

        {currentScreen === "location" && (
          <LocationSelectionScreen 
            key="location" 
            onContinue={handleLocationMethod} 
          />
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
            useLocation={useLocation && currentQuestionIndex === 0}
            locationMode={locationMode}
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
