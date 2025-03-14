
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

      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-nashville-900 to-nashville-accent dark:from-white dark:to-nashville-accent">
          {isNeighborhoodQuestion && <MapPin className="inline-block mr-2 mb-1" />}
          {question.question}
        </h2>
        {question.description && (
          <p className="text-nashville-600 dark:text-nashville-400">{question.description}</p>
        )}
      </div>

      {isNeighborhoodQuestion ? (
        <div className="relative w-full aspect-[4/3] mb-8 rounded-xl overflow-hidden shadow-lg">
          {/* Nashville Map Background */}
          <div className="absolute inset-0 bg-nashville-50 dark:bg-nashville-800/50 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1548098338-9babf1bcbf1f?q=80&w=1000&auto=format&fit=crop" 
              alt="Nashville Map" 
              className="w-full h-full object-cover opacity-30 dark:opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20"></div>
            
            {/* Cumberland River */}
            <motion.div 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M100,80 C150,70 170,120 180,150 C190,180 230,220 300,220" 
                  stroke="#6EB4D1" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(110, 180, 209, 0.5))' }}
                />
              </svg>
            </motion.div>
            
            {/* Interstate Highways */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,150 L400,150" stroke="#B9B9B9" strokeWidth="3" strokeDasharray="5,5" />
                <path d="M200,0 L200,300" stroke="#B9B9B9" strokeWidth="3" strokeDasharray="5,5" />
              </svg>
            </motion.div>
          </div>

          {/* Neighborhood Markers */}
          <div className="absolute inset-0">
            {question.options.map((option, index) => {
              // Define positions for each neighborhood
              const positions = {
                east: { top: '40%', left: '65%' },
                gulch: { top: '55%', left: '42%' },
                downtown: { top: '50%', left: '52%' },
                '12south': { top: '65%', left: '45%' },
              };
              
              // Get position based on option value
              const position = positions[option.value as keyof typeof positions];
              
              return (
                <motion.div
                  key={option.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: selectedAnswer === option.value ? 1.1 : 1, 
                    opacity: 1 
                  }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.4,
                    scale: { 
                      duration: 0.2,
                      type: "spring", 
                      stiffness: 300
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAnswer(question.id, option.value)}
                  className={`absolute cursor-pointer ${selectedAnswer === option.value ? 'z-10' : 'z-0'}`}
                  style={{
                    top: position.top,
                    left: position.left,
                  }}
                >
                  <div 
                    className={`
                      neighborhood-marker p-1 rounded-full 
                      ${selectedAnswer === option.value 
                        ? 'ring-4 ring-nashville-accent ring-opacity-70' 
                        : 'hover:ring-2 hover:ring-nashville-accent/50'
                      }
                    `}
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img 
                        src={option.image} 
                        alt={option.text} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`
                      absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full
                      text-center mt-2 font-bold text-sm md:text-base px-3 py-1 rounded-lg
                      ${selectedAnswer === option.value 
                        ? 'bg-nashville-accent text-nashville-900' 
                        : 'bg-white/90 dark:bg-nashville-800/90'
                      }
                      shadow-md whitespace-nowrap
                    `}>
                      {option.text}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-white/70 dark:bg-nashville-900/70 backdrop-blur-sm px-2 py-1 rounded text-xs opacity-70">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-[#6EB4D1] mr-1 rounded-full"></div>
              <span>Cumberland River</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 mb-12`}>
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
                  <div className="h-40 mb-3 rounded-md overflow-hidden shadow-sm">
                    <img 
                      src={option.image} 
                      alt={option.text} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                )}
                <div className="flex items-center p-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{option.text}</h3>
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
      )}

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
