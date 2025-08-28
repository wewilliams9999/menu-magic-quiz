
import { AnimatePresence } from "framer-motion";
import LocationSelectionScreen from "./LocationSelectionScreen";
import QuizQuestion from "./QuizQuestion";
import ResultScreen from "./ResultScreen";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { useQuizState } from "@/hooks/useQuizState";
import { getQuizQuestions, processAnswersForAPI } from "@/utils/quizLogic";
import { useQuizNavigation } from "./quiz/QuizNavigation";

const QuizContainer = () => {
  const {
    currentScreen,
    setCurrentScreen,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    locationMode,
    userCoordinates,
    handleAnswer,
    handleUserLocationUpdate,
    handleReset,
    handleRetry,
  } = useQuizState();

  // Only trigger the query when we're on the result screen
  const shouldFetchData = currentScreen === "result";
  
  // Prepare hook parameters
  const hookParams = shouldFetchData ? {
    ...processAnswersForAPI(answers),
    userLocation: userCoordinates
  } : {};
  
  // Use the restaurant data hook with conditional fetching
  const { data: restaurantResults, isLoading, error } = useRestaurantData(hookParams);

  console.log("=== QUIZ CONTAINER DEBUG ===");
  console.log("Current screen:", currentScreen);
  console.log("Should fetch data:", shouldFetchData);
  console.log("Hook params:", hookParams);
  console.log("Answers:", answers);
  console.log("Restaurant results type:", typeof restaurantResults);
  console.log("Restaurant results:", restaurantResults);
  console.log("Restaurant results length:", restaurantResults?.length);
  console.log("Is loading from hook:", isLoading);
  console.log("Hook error:", error);
  console.log("=== END DEBUG ===");

  // Get questions function
  const questions = getQuizQuestions(locationMode);

  const { handleNextQuestion, handlePreviousQuestion } = useQuizNavigation({
    currentQuestionIndex,
    totalQuestions: questions.length,
    answers,
    locationMode,
    setCurrentScreen,
    setCurrentQuestionIndex,
    error,
  });

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  // Ensure we always pass an array to ResultScreen
  const safeRestaurantResults = Array.isArray(restaurantResults) ? restaurantResults : [];

  // Get the requested distance from answers
  const requestedDistance = typeof answers.distance === 'number' ? answers.distance : undefined;

  return (
    <div className="min-h-screen sm:min-h-[80vh] flex flex-col justify-center bg-gradient-to-b from-black to-gray-900 text-white p-4 sm:p-6 lg:p-8">
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
            totalQuestions={questions.length}
            useLocation={locationMode && currentQuestion.id === "distance"}
            locationMode={locationMode}
          />
        )}

        {currentScreen === "result" && (
          <ResultScreen 
            key="result" 
            results={safeRestaurantResults} 
            onReset={handleReset}
            onRetry={handleRetry}
            isLoading={isLoading}
            requestedDistance={requestedDistance}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizContainer;
