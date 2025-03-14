
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizQuestion as QuizQuestionType, QuizOption } from "@/utils/quizData";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (questionId: string, answerId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  selectedAnswer: string | null;
  currentIndex: number;
  totalQuestions: number;
}

const QuizQuestion = ({
  question,
  onAnswer,
  onNext,
  onPrevious,
  selectedAnswer,
  currentIndex,
  totalQuestions,
}: QuizQuestionProps) => {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-nashville-500">Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="text-sm text-nashville-500">{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-nashville-100 dark:bg-nashville-800 rounded-full h-1.5">
          <motion.div
            initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            className="bg-nashville-accent h-1.5 rounded-full"
          ></motion.div>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">{question.question}</h2>
        {question.description && (
          <p className="text-nashville-600 dark:text-nashville-400">{question.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => onAnswer(question.id, option.value)}
            className={`option-card ${selectedAnswer === option.value ? "selected" : ""}`}
          >
            {option.image && (
              <div className="mb-3 rounded-md overflow-hidden h-32">
                <img 
                  src={option.image} 
                  alt={option.text} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            )}
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{option.text}</h3>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedAnswer === option.value
                  ? "border-nashville-accent bg-nashville-accent/20"
                  : "border-nashville-300"
              }`}>
                {selectedAnswer === option.value && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 bg-nashville-accent rounded-full" 
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button 
          onClick={onPrevious}
          variant="outline"
          className="border-nashville-300 hover:bg-nashville-100 dark:hover:bg-nashville-800 text-nashville-600 dark:text-nashville-400"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedAnswer}
          className="bg-nashville-900 hover:bg-nashville-800 text-white transition-all duration-300"
        >
          {currentIndex === totalQuestions - 1 ? (
            "See Results"
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
