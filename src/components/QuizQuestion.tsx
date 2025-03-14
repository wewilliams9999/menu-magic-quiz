
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
          <div className="absolute inset-0 bg-gradient-to-br from-nashville-50/80 to-nashville-100/90 dark:from-nashville-800/80 dark:to-nashville-900/90 overflow-hidden">
            {/* Map Texture */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Cumberland River */}
            <motion.div 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M50,110 C100,90 150,120 180,150 C210,180 250,220 350,220" 
                  stroke="#6EB4D1" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(110, 180, 209, 0.8))' }}
                />
              </svg>
            </motion.div>
            
            {/* Interstate Highways */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* I-40 */}
                <path d="M0,150 L400,150" stroke="#DDD" strokeWidth="4" />
                {/* I-65 */}
                <path d="M200,0 L200,300" stroke="#DDD" strokeWidth="4" />
                {/* I-24 */}
                <path d="M50,50 L350,250" stroke="#DDD" strokeWidth="4" strokeDasharray="8,8" />
                {/* I-440 */}
                <ellipse cx="200" cy="150" rx="100" ry="80" stroke="#DDD" strokeWidth="3" strokeDasharray="5,5" fill="none" />
              </svg>
            </motion.div>
          </div>

          {/* Neighborhood Markers */}
          <div className="absolute inset-0">
            {[
              // Core Nashville neighborhoods - rearranged for better spacing
              { id: "east", name: "East Nashville", position: { top: '32%', left: '70%' }, color: "from-[#F97316] to-[#FBBF24]", rotate: "-5deg" },
              { id: "gulch", name: "The Gulch", position: { top: '58%', left: '47%' }, color: "from-[#8B5CF6] to-[#D946EF]", rotate: "3deg" },
              { id: "downtown", name: "Downtown", position: { top: '48%', left: '54%' }, color: "from-[#0EA5E9] to-[#22D3EE]", rotate: "0deg" },
              { id: "12south", name: "12 South", position: { top: '68%', left: '45%' }, color: "from-[#10B981] to-[#34D399]", rotate: "-2deg" },
              { id: "germantown", name: "Germantown", position: { top: '38%', left: '52%' }, color: "from-[#EC4899] to-[#F472B6]", rotate: "2deg" },
              { id: "music-row", name: "Music Row", position: { top: '62%', left: '35%' }, color: "from-[#EF4444] to-[#F87171]", rotate: "-3deg" },
              { id: "berry-hill", name: "Berry Hill", position: { top: '80%', left: '35%' }, color: "from-[#6366F1] to-[#A78BFA]", rotate: "4deg" },
              { id: "west-end", name: "West End", position: { top: '43%', left: '33%' }, color: "from-[#F59E0B] to-[#FBBF24]", rotate: "-1deg" },
              { id: "belle-meade", name: "Belle Meade", position: { top: '30%', left: '15%' }, color: "from-[#4F46E5] to-[#6366F1]", rotate: "2deg" },
              { id: "bellevue", name: "Bellevue", position: { top: '15%', left: '10%' }, color: "from-[#059669] to-[#10B981]", rotate: "-4deg" },
              { id: "opryland", name: "Opryland", position: { top: '15%', left: '85%' }, color: "from-[#DC2626] to-[#EF4444]", rotate: "3deg" },
              { id: "madison", name: "Madison", position: { top: '10%', left: '60%' }, color: "from-[#7C3AED] to-[#8B5CF6]", rotate: "-2deg" },
              
              // New North Nashville neighborhoods
              { id: "north-nashville", name: "North Nashville", position: { top: '25%', left: '48%' }, color: "from-[#0369A1] to-[#0EA5E9]", rotate: "2deg" },
              { id: "bordeaux", name: "Bordeaux", position: { top: '18%', left: '35%' }, color: "from-[#A16207] to-[#CA8A04]", rotate: "-3deg" },
              { id: "whites-creek", name: "Whites Creek", position: { top: '5%', left: '45%' }, color: "from-[#15803D] to-[#22C55E]", rotate: "1deg" },
              
              // Franklin & Brentwood (south of Nashville)
              { id: "franklin", name: "Franklin", position: { top: '95%', left: '45%' }, color: "from-[#9D174D] to-[#EC4899]", rotate: "-2deg" },
              { id: "brentwood", name: "Brentwood", position: { top: '88%', left: '58%' }, color: "from-[#5B21B6] to-[#7C3AED]", rotate: "3deg" },
              { id: "green-hills", name: "Green Hills", position: { top: '75%', left: '25%' }, color: "from-[#065F46] to-[#10B981]", rotate: "-1deg" },
            ].map((neighborhood) => {
              const isActive = selectedAnswer === neighborhood.id;
              
              return (
                <motion.div
                  key={neighborhood.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isActive ? 1.1 : 1, 
                    opacity: 1,
                    y: isActive ? -5 : 0
                  }}
                  transition={{ 
                    delay: Math.random() * 0.4,
                    duration: 0.4,
                    scale: { 
                      duration: 0.2,
                      type: "spring", 
                      stiffness: 300
                    }
                  }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAnswer(question.id, neighborhood.id)}
                  className={`absolute cursor-pointer ${isActive ? 'z-20' : 'z-10'}`}
                  style={{
                    top: neighborhood.position.top,
                    left: neighborhood.position.left,
                  }}
                >
                  <div 
                    className={`
                      neighborhood-marker p-1 rounded-full 
                      ${isActive 
                        ? 'ring-4 ring-nashville-accent ring-opacity-70' 
                        : 'hover:ring-2 hover:ring-nashville-accent/50'
                      }
                    `}
                  >
                    <div 
                      className={`
                        w-14 h-14 md:w-18 md:h-18 rounded-full overflow-hidden 
                        flex items-center justify-center
                        bg-gradient-to-br ${neighborhood.color}
                        shadow-lg
                        ${isActive ? 'shadow-nashville-accent/30' : ''}
                      `}
                      style={{ transform: `rotate(${neighborhood.rotate})` }}
                    >
                      <div className="text-center text-white font-bold p-1 text-[10px] md:text-xs leading-tight drop-shadow-md">
                        {neighborhood.name}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-white/80 dark:bg-nashville-900/80 backdrop-blur-sm px-3 py-2 rounded-lg text-xs opacity-80 shadow-sm">
            <div className="flex items-center gap-1">
              <div className="w-5 h-1.5 bg-[#6EB4D1] rounded-full shadow-sm"></div>
              <span>Cumberland River</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-5 h-1.5 bg-[#DDD] rounded-full shadow-sm"></div>
              <span>Interstate Highways</span>
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
