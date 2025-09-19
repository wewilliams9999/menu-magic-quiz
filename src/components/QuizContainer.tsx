
import { AnimatePresence } from "framer-motion";
import LocationSelectionScreen from "./LocationSelectionScreen";
import QuizQuestion from "./QuizQuestion";
import ResultScreen from "./ResultScreen";
import ApiErrorDialog from "./ApiErrorDialog";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { useQuizState } from "@/hooks/useQuizState";
import { getQuizQuestions, processAnswersForAPI } from "@/utils/quizLogic";
import { useQuizNavigation } from "./quiz/QuizNavigation";
import { QuizResult } from "@/utils/quizData";
import { useState } from "react";

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

  // State for managing mock data fallback
  const [mockResults, setMockResults] = useState<QuizResult[] | null>(null);
  const [showApiError, setShowApiError] = useState(false);

  // Only trigger the query when we're on the result screen
  const shouldFetchData = currentScreen === "result" && !mockResults;
  
  // Prepare hook parameters
  const hookParams = shouldFetchData ? {
    ...processAnswersForAPI(answers),
    userLocation: userCoordinates
  } : {};
  
  // Use the restaurant data hook with conditional fetching
  const { data: apiResponse, isLoading, error } = useRestaurantData(hookParams);

  console.log("=== QUIZ CONTAINER DEBUG ===");
  console.log("Current screen:", currentScreen);
  console.log("Should fetch data:", shouldFetchData);
  console.log("Hook params:", hookParams);
  console.log("Answers:", answers);
  console.log("API Response:", apiResponse);
  console.log("Mock results:", mockResults);
  console.log("Show API error:", showApiError);
  console.log("Is loading from hook:", isLoading);
  console.log("Hook error:", error);
  console.log("=== END DEBUG ===");

  // Handle API response status
  let restaurantResults: QuizResult[] = [];
  let shouldShowApiError = false;

  if (mockResults) {
    // Use mock data if available
    restaurantResults = mockResults;
  } else if (apiResponse) {
    if (apiResponse.status === 'success') {
      restaurantResults = apiResponse.results;
    } else if (apiResponse.status === 'api_failed' || apiResponse.status === 'no_results') {
      shouldShowApiError = true;
    }
  }

  // Show API error dialog when appropriate
  if (currentScreen === "result" && shouldShowApiError && !showApiError && !mockResults) {
    setShowApiError(true);
  }

  const handleUseMockData = (mockData: QuizResult[]) => {
    setMockResults(mockData);
    setShowApiError(false);
  };

  const handleRetryApi = () => {
    setShowApiError(false);
    setMockResults(null);
    // This will trigger a refetch
  };

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

  // Reset states when starting over
  const handleResetWithCleanup = () => {
    setMockResults(null);
    setShowApiError(false);
    handleReset();
  };

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

        {currentScreen === "result" && showApiError && (
          <ApiErrorDialog
            key="api-error"
            error={apiResponse?.error || 'Unknown API error'}
            onUseMockData={handleUseMockData}
            onRetry={handleRetryApi}
            apiParams={hookParams}
          />
        )}

        {currentScreen === "result" && !showApiError && (
          <ResultScreen 
            key="result" 
            results={safeRestaurantResults} 
            onReset={handleResetWithCleanup}
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
