
import { useState, useEffect } from "react";
import { QuizQuestion as QuizQuestionType } from "@/utils/quizData";
import QuestionBase from "./questions/QuestionBase";
import CuisineQuestion from "./questions/CuisineQuestion";
import StandardQuestion from "./questions/StandardQuestion";
import PreferencesQuestion from "./questions/PreferencesQuestion";
import NeighborhoodSelector from "./NeighborhoodSelector";
import DistanceSelector from "./DistanceSelector";

type AnswerValue = string | string[] | number;

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (questionId: string, answerId: AnswerValue) => void;
  onNext: () => void;
  onPrevious: () => void;
  selectedAnswer: AnswerValue | null;
  currentIndex: number;
  totalQuestions: number;
  useLocation?: boolean;
  locationMode?: boolean;
}

const QuizQuestion = ({
  question,
  onAnswer,
  onNext,
  onPrevious,
  selectedAnswer,
  currentIndex,
  totalQuestions,
  useLocation = false,
  locationMode = false,
}: QuizQuestionProps) => {
  const isNeighborhoodQuestion = question.id === "neighborhood";
  const isDistanceQuestion = question.id === "distance";
  const isPreferencesQuestion = question.id === "preferences";
  const isCuisineQuestion = question.id === "cuisine";
  const isMultiSelect = question.multiSelect || false;
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Effect to handle location initialization
  useEffect(() => {
    // Only attempt to get user location if this is the distance question and we're in location mode
    if (isDistanceQuestion && locationMode) {
      // We don't automatically request location here anymore
      // The DistanceSelector component will handle this with explicit user interaction
    }
  }, [isDistanceQuestion, locationMode]);

  // Fix: Modified the auto-proceed logic to be less restrictive 
  // Now it only requires having a selected distance, not necessarily a user location
  useEffect(() => {
    if (isDistanceQuestion && typeof selectedAnswer === 'number') {
      // Small delay for better UX to see the selection
      const timer = setTimeout(() => {
        onNext();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isDistanceQuestion, selectedAnswer, onNext]);

  const getSelectedArray = () => {
    if (isMultiSelect) {
      return Array.isArray(selectedAnswer) ? selectedAnswer : [];
    }
    return [];
  };

  const convertToNeighborhoodFormat = (options: any[]) => {
    return options.map(option => ({
      id: option.value,
      name: option.text
    }));
  };

  // Fix: Modified the next button disabled logic for distance questions
  // Now it only checks if there's a selected answer, not necessarily a user location
  const isNextDisabled = isMultiSelect 
    ? getSelectedArray().length === 0 
    : (isDistanceQuestion && !selectedAnswer) || !selectedAnswer;

  // Determine which question component to render
  const renderQuestionComponent = () => {
    if (isDistanceQuestion) {
      return (
        <div className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-nashville-200 dark:border-nashville-800 shadow-lg">
          <DistanceSelector 
            onSelect={(distance: number) => {
              onAnswer(question.id, distance);
              setUserLocation(userLocation);
            }}
            selectedDistance={typeof selectedAnswer === 'number' ? selectedAnswer : 3}
            options={question.options}
            userLocation={userLocation}
          />
        </div>
      );
    }
    
    if (isNeighborhoodQuestion) {
      return (
        <div className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-nashville-200 dark:border-nashville-800 shadow-lg">
          <NeighborhoodSelector 
            neighborhoods={convertToNeighborhoodFormat(question.options)} 
            selectedNeighborhoods={getSelectedArray()}
            onSelect={(values: string[]) => onAnswer(question.id, values)}
            useUserLocation={useLocation}
          />
        </div>
      );
    }
    
    if (isPreferencesQuestion) {
      return (
        <PreferencesQuestion 
          options={question.options} 
          selectedAnswers={getSelectedArray()} 
          onSelect={(values) => onAnswer(question.id, values)} 
        />
      );
    }
    
    if (isCuisineQuestion) {
      return (
        <CuisineQuestion 
          options={question.options} 
          selectedAnswer={selectedAnswer as string | null} 
          onSelect={(value) => onAnswer(question.id, value)} 
        />
      );
    }
    
    // Default to standard question
    return (
      <StandardQuestion 
        options={question.options} 
        selectedAnswer={selectedAnswer as string | null} 
        onSelect={(value) => onAnswer(question.id, value)} 
      />
    );
  };

  return (
    <QuestionBase
      questionText={question.question}
      description={question.description}
      currentIndex={currentIndex}
      totalQuestions={totalQuestions}
      onNext={onNext}
      onPrevious={onPrevious}
      isNextDisabled={isNextDisabled}
    >
      {renderQuestionComponent()}
    </QuestionBase>
  );
};

export default QuizQuestion;
