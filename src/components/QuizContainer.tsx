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

  // Get the appropriate questions based on location mode
  const getQuestions = () => {
    // Filter out the locationMethod question since we already asked this in LocationSelectionScreen
    const filteredQuestions = quizQuestions.filter(q => q.id !== "locationMethod");
    
    if (locationMode) {
      // If using location, replace the "neighborhood" question with "distance"
      const neighborhoodIndex = filteredQuestions.findIndex(q => q.id === "neighborhood");
      if (neighborhoodIndex !== -1) {
        filteredQuestions[neighborhoodIndex] = {
          id: "distance",
          questionText: "How far would you like to travel?",
          question: "How far would you like to travel?",
          description: "We'll find restaurants within this distance from your location",
          type: "singleChoice",
          options: filteredQuestions[neighborhoodIndex].options,
        };
      }
    }
    
    return filteredQuestions;
  };

  const handleStart = () => {
    setCurrentScreen("location");
  };

  const handleAnswer = (questionId: string, answerId: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));

    // If this is from the location method screen, set the location mode and move to the quiz
    if (questionId === "locationMethod") {
      const isLocationBased = answerId === "location";
      setLocationMode(isLocationBased);
      
      // If location-based, also set initial distance
      if (isLocationBased) {
        setAnswers((prev) => ({
          ...prev,
          distance: 5, // Default 5 mile radius
        }));
      }
      
      // Move directly to the quiz questions after selecting location method
      setCurrentScreen("quiz");
      setCurrentQuestionIndex(0);
    }
  };

  const handleNextQuestion = () => {
    const questions = getQuestions();
    
    if (currentQuestionIndex === questions.length - 1) {
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
      // Go back to location screen if we're at the first question
      setCurrentScreen("location");
    }
  };

  const handleReset = () => {
    setCurrentScreen("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setLocationMode(false);
  };

  // Get the current question
  const currentQuestion = getQuestions()[currentQuestionIndex];

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {currentScreen === "welcome" && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}

        {currentScreen === "location" && (
          <LocationSelectionScreen 
            key="location" 
            onAnswer={handleAnswer}
          />
        )}

        {currentScreen === "quiz" && currentQuestion && (
          <QuizQuestion
            key={`question-${currentQuestionIndex}`}
            question={currentQuestion}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            selectedAnswer={answers[currentQuestion.id] || null}
            currentIndex={currentQuestionIndex}
            totalQuestions={getQuestions().length}
            useLocation={locationMode && currentQuestion.id === "distance"}
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
