
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
    <div className="relative">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-red-500/3 rounded-full blur-2xl"
        />
      </div>

      <motion.div
        key={`question-${currentIndex}`}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
            <motion.span 
              className="font-medium text-red-200"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Question {currentIndex + 1} of {totalQuestions}
            </motion.span>
            <span className="font-medium text-red-200">{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700/50 backdrop-blur-sm rounded-full h-2 sm:h-2.5 overflow-hidden border border-red-500/10">
            <motion.div
              initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
              animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              className="bg-gradient-to-r from-red-500 via-red-400 to-red-300 h-2 sm:h-2.5 rounded-full relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-red-500 leading-tight"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(239, 68, 68, 0.5)",
                "0 0 40px rgba(239, 68, 68, 0.3)",
                "0 0 20px rgba(239, 68, 68, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {questionText}
          </motion.h2>
          {description && (
            <motion.p 
              className="text-white text-opacity-90 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Navigation buttons with enhanced styling */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button 
            onClick={onPrevious}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300 px-4 sm:px-6 py-3 sm:py-2 touch-manipulation hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button 
            onClick={onNext}
            disabled={isNextDisabled}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none px-4 sm:px-6 py-3 sm:py-2 touch-manipulation hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuestionBase;
