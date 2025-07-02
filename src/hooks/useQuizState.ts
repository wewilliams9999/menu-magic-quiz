
import { useState } from "react";

type AnswerValue = string | string[] | number;

export const useQuizState = () => {
  const [currentScreen, setCurrentScreen] = useState<"location" | "quiz" | "result">("location");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [locationMode, setLocationMode] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | undefined>(undefined);

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

  const handleUserLocationUpdate = (coords: { latitude: number; longitude: number }) => {
    setUserCoordinates(coords);
    console.log("User coordinates set:", coords);
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

  return {
    currentScreen,
    setCurrentScreen,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswers,
    locationMode,
    setLocationMode,
    userCoordinates,
    setUserCoordinates,
    handleAnswer,
    handleUserLocationUpdate,
    handleReset,
    handleRetry,
  };
};
