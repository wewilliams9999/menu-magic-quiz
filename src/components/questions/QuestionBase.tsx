
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
      {/* Cozy floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-cozy-peach/20 to-cozy-pink/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            y: [10, -10, 10],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-cozy-warm/15 to-cozy-cream/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: 360
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cozy-peach/5 via-cozy-pink/5 to-cozy-warm/5 rounded-full blur-3xl"
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
              className="font-semibold text-primary/80"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Question {currentIndex + 1} of {totalQuestions}
            </motion.span>
            <span className="font-semibold text-primary/80">{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted/30 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-primary/20 shadow-inner">
            <motion.div
              initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
              animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              className="bg-gradient-to-r from-cozy-peach via-cozy-pink to-cozy-warm h-3 rounded-full relative overflow-hidden shadow-lg"
            >
              <motion.div
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full"></div>
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
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 cozy-text leading-tight"
            animate={{ 
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {questionText}
          </motion.h2>
          {description && (
            <motion.p 
              className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
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
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 px-6 py-3 rounded-2xl touch-manipulation hover:scale-105 cozy-glow"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button 
            onClick={onNext}
            disabled={isNextDisabled}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none px-6 py-3 rounded-2xl touch-manipulation hover:scale-105 cozy-glow"
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
