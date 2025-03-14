
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizQuestion as QuizQuestionType, QuizOption } from "@/utils/quizData";
import { ChevronLeft, ChevronRight, CheckCircle, MapPin } from "lucide-react";

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
  // Determine if this is the neighborhood question
  const isNeighborhoodQuestion = question.id === "neighborhood";

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-nashville-600 dark:text-nashville-400">Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="text-sm font-medium text-nashville-600 dark:text-nashville-400">{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-nashville-100 dark:bg-nashville-800 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            className="bg-gradient-to-r from-nashville-accent to-nashville-accent/80 h-2.5 rounded-full"
          ></motion.div>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-nashville-900 to-nashville-accent dark:from-white dark:to-nashville-accent">
          {isNeighborhoodQuestion && <MapPin className="inline-block mr-2 mb-1" />}
          {question.question}
        </h2>
        {question.description && (
          <p className="text-nashville-600 dark:text-nashville-400">{question.description}</p>
        )}
      </div>

      <div className={`grid grid-cols-1 ${isNeighborhoodQuestion ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-5 mb-12`}>
        {question.options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={() => onAnswer(question.id, option.value)}
              className={`option-card relative overflow-hidden rounded-lg ${
                selectedAnswer === option.value 
                  ? "border-nashville-accent bg-nashville-50 dark:bg-nashville-800/50" 
                  : "border-transparent hover:border-nashville-200 dark:hover:border-nashville-700"
              }`}
            >
              {option.image && (
                <div className={`${isNeighborhoodQuestion ? 'h-48' : 'h-40'} mb-3 rounded-md overflow-hidden shadow-sm`}>
                  <img 
                    src={option.image} 
                    alt={option.text} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {isNeighborhoodQuestion && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-3 left-3 text-white font-bold text-xl drop-shadow-md">
                        {option.text}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center p-4">
                <div className="flex-1">
                  {!isNeighborhoodQuestion && <h3 className="font-medium text-lg">{option.text}</h3>}
                  {isNeighborhoodQuestion && <h3 className="font-medium text-lg opacity-0">{option.text}</h3>}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedAnswer === option.value
                    ? "border-nashville-accent bg-nashville-accent/20"
                    : "border-nashville-300"
                }`}>
                  {selectedAnswer === option.value && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-nashville-accent" 
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
              </div>
              
              {selectedAnswer === option.value && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 border-2 border-nashville-accent rounded-lg pointer-events-none"
                />
              )}
            </motion.div>
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
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onNext}
            disabled={!selectedAnswer}
            className="bg-gradient-to-r from-nashville-accent to-nashville-accent/80 hover:from-nashville-accent/90 hover:to-nashville-accent/70 text-nashville-900 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
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
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
