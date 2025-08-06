
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionBaseProps {
  questionText: string;
  description?: string;
  currentIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled: boolean;
  children: React.ReactNode;
}

const QuestionBase = ({
  questionText,
  description,
  currentIndex,
  totalQuestions,
  onNext,
  onPrevious,
  isNextDisabled,
  children,
}: QuestionBaseProps) => {
  return (
    <motion.div
      key={`question-${currentIndex}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
          <span className="font-medium text-red-200">Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="font-medium text-red-200">{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 sm:h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            className="bg-gradient-to-r from-red-500 to-red-400 h-2 sm:h-2.5 rounded-full"
          ></motion.div>
        </div>
      </div>

      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-red-500 leading-tight">
          {questionText}
        </h2>
        {description && (
          <p className="text-white text-opacity-90 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">{description}</p>
        )}
      </div>

      {/* Navigation buttons with updated styling */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
        <Button 
          onClick={onPrevious}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300 px-4 sm:px-6 py-3 sm:py-2 touch-manipulation"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={isNextDisabled}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none px-4 sm:px-6 py-3 sm:py-2 touch-manipulation"
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

      {children}
    </motion.div>
  );
};

export default QuestionBase;
