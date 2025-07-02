
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import LocationSelectionScreen from "./LocationSelectionScreen";
import QuizQuestion from "./QuizQuestion";
import ResultScreen from "./ResultScreen";
import { quizQuestions } from "@/utils/quiz";
import { useRestaurantData } from "@/hooks/useRestaurantData";

type AnswerValue = string | string[] | number;

const QuizContainer = () => {
  const [currentScreen, setCurrentScreen] = useState<"location" | "quiz" | "result">("location");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [locationMode, setLocationMode] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  
  // Get neighborhoods as string array for the API
  const neighborhoods = answers.neighborhood && Array.isArray(answers.neighborhood) 
    ? answers.neighborhood 
    : (answers.neighborhood ? [answers.neighborhood as string] : []);
  
  // Get preferences as string array for the API
  const preferences = answers.preferences && Array.isArray(answers.preferences)
    ? answers.preferences
    : (answers.preferences ? [answers.preferences as string] : []);
  
  // Get price as string array for the API - handle both multi-select and single-select cases
  const prices = answers.price 
    ? (Array.isArray(answers.price) ? answers.price : [answers.price as string])
    : [];
    
  // Get cuisine as string array for the API
  const cuisines = answers.cuisine && Array.isArray(answers.cuisine)
    ? answers.cuisine
    : (answers.cuisine ? [answers.cuisine as string] : []);
  
  // Get distance value for location-based search
  const distance = typeof answers.distance === 'number' ? answers.distance : undefined;
  
  // Only trigger the query when we have enough data and are on the result screen
  const shouldFetchData = currentScreen === "result" && (
    (neighborhoods.length > 0) || 
    (distance && userCoordinates) ||
    cuisines.length > 0 || 
    prices.length > 0
  );
  
  // Use the restaurant data hook
  const { data: restaurantResults, isLoading, error } = useRestaurantData({
    neighborhoods: neighborhoods.length > 0 ? neighborhoods : undefined,
    cuisine: cuisines.length > 0 ? cuisines : undefined,
    price: prices.length > 0 ? prices : undefined,
    atmosphere: answers.atmosphere as string,
    preferences: preferences.length > 0 ? preferences : undefined,
    distance: distance,
    userLocation: userCoordinates
  });

  console.log("=== QUIZ CONTAINER DEBUG ===");
  console.log("Current screen:", currentScreen);
  console.log("Should fetch data:", shouldFetchData);
  console.log("Answers:", answers);
  console.log("Restaurant results:", restaurantResults);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);
  console.log("=== END DEBUG ===");

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
          options: [
            { id: "1-mile", text: "1 mile", value: "1" },
            { id: "3-miles", text: "3 miles", value: "3" },
            { id: "5-miles", text: "5 miles", value: "5" },
            { id: "10-miles", text: "10 miles", value: "10" }
          ],
        };
      }
    }
    
    return filteredQuestions;
  };

  const handleAnswer = (questionId: string, answerId: AnswerValue) => {
    console.log("Answer received:", questionId, answerId);
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));

    // If this is from the location method screen, set the location mode and move to the quiz
    if (questionId === "locationMethod") {
      const isLocationBased = answerId === "location";
      setLocationMode(isLocationBased);
      
      // If location-based, also set initial distance to 3 miles
      if (isLocationBased) {
        setAnswers((prev) => ({
          ...prev,
          distance: 3, // Default to 3 mile radius
        }));
      }
      
      // Move directly to the quiz questions after selecting location method
      setCurrentScreen("quiz");
      setCurrentQuestionIndex(0);
    }
  };

  // New function to handle user location updates
  const handleUserLocationUpdate = (coords: { latitude: number; longitude: number }) => {
    setUserCoordinates(coords);
    console.log("User coordinates set:", coords);
  };

  const handleNextQuestion = () => {
    const questions = getQuestions();
    
    if (currentQuestionIndex === questions.length - 1) {
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

  const handleReset = () => {
    setCurrentScreen("location");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setLocationMode(false);
    setUserCoordinates(undefined);
  };

  const handleRetry = () => {
    // Go back to the first question to retry
    setCurrentScreen("quiz");
    setCurrentQuestionIndex(0);
  };

  // Get the current question
  const currentQuestion = getQuestions()[currentQuestionIndex];

  return (
    <div className="min-h-[80vh] flex flex-col justify-center bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <AnimatePresence mode="wait">
        {currentScreen === "location" && (
          <LocationSelectionScreen 
            key="location" 
            onAnswer={handleAnswer}
            onUserLocationUpdate={handleUserLocationUpdate}
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
            onRetry={handleRetry}
            isLoading={isLoading} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizContainer;
