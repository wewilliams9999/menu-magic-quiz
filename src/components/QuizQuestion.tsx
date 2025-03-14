import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizQuestion as QuizQuestionType, QuizOption } from "@/utils/quizData";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Check, 
  Utensils,
  VolumeX,
  ParkingSquare,
  DollarSign,
  TreeDeciduous,
  Baby,
  Sparkles,
  Clock,
  Music,
  XCircle
} from "lucide-react";
import NeighborhoodSelector from "./NeighborhoodSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (questionId: string, answerId: string | string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  selectedAnswer: string | string[] | null;
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
  const isNeighborhoodQuestion = question.id === "neighborhood";
  const isPreferencesQuestion = question.id === "preferences";
  const isCuisineQuestion = question.id === "cuisine";
  const isMultiSelect = question.multiSelect || false;

  const handleMultiSelectChange = (id: string, checked: boolean) => {
    const currentSelected = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
    
    if (id === 'none' && checked) {
      onAnswer(question.id, ['none']);
      return;
    } else if (checked && currentSelected.includes('none')) {
      const newSelection = currentSelected.filter(item => item !== 'none');
      onAnswer(question.id, [...newSelection, id]);
      return;
    }
    
    if (checked) {
      onAnswer(question.id, [...currentSelected, id]);
    } else {
      onAnswer(question.id, currentSelected.filter(item => item !== id));
    }
  };

  const getSelectedArray = () => {
    if (isMultiSelect) {
      return Array.isArray(selectedAnswer) ? selectedAnswer : [];
    }
    return [];
  };

  const getPreferenceIcon = (value: string) => {
    switch (value) {
      case 'none':
        return <XCircle className="w-5 h-5" />;
      case 'quiet':
        return <VolumeX className="w-5 h-5" />;
      case 'parking':
        return <ParkingSquare className="w-5 h-5" />;
      case 'budget':
        return <DollarSign className="w-5 h-5" />;
      case 'outdoor':
        return <TreeDeciduous className="w-5 h-5" />;
      case 'family':
        return <Baby className="w-5 h-5" />;
      case 'unique':
        return <Sparkles className="w-5 h-5" />;
      case 'late-night':
        return <Clock className="w-5 h-5" />;
      case 'music':
        return <Music className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto px-4"
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
          {question.question}
        </h2>
        {question.description && (
          <p className="text-nashville-600 dark:text-nashville-400">{question.description}</p>
        )}
      </div>

      {isNeighborhoodQuestion ? (
        <div className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-nashville-200 dark:border-nashville-800 shadow-lg">
          <NeighborhoodSelector 
            options={question.options} 
            selectedValues={getSelectedArray()}
            onChange={(values: string[]) => onAnswer(question.id, values)}
          />
        </div>
      ) : isPreferencesQuestion ? (
        <div className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-nashville-200 dark:border-nashville-800 shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option) => (
              <div 
                key={option.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-nashville-100/50 dark:hover:bg-nashville-800/50 transition-colors"
              >
                <Checkbox 
                  id={option.id}
                  checked={getSelectedArray().includes(option.value)}
                  onCheckedChange={(checked) => {
                    handleMultiSelectChange(option.value, checked === true);
                  }}
                  className="mt-1 data-[state=checked]:bg-nashville-accent data-[state=checked]:border-nashville-accent"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={`text-nashville-accent ${getSelectedArray().includes(option.value) ? 'opacity-100' : 'opacity-70'}`}>
                      {getPreferenceIcon(option.value)}
                    </div>
                    <Label
                      htmlFor={option.id}
                      className="text-base font-medium cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isCuisineQuestion ? (
        <div className="grid grid-cols-1 gap-4 mb-12">
          {question.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => onAnswer(question.id, option.value)}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option.value 
                    ? "bg-gradient-to-r from-nashville-accent/20 to-nashville-accent/10 border-l-4 border-nashville-accent" 
                    : "bg-white/5 dark:bg-black/5 hover:bg-nashville-100/30 dark:hover:bg-nashville-800/30 border-l-4 border-transparent"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  selectedAnswer === option.value
                    ? "bg-nashville-accent text-white"
                    : "bg-nashville-100 dark:bg-nashville-800 text-nashville-500 dark:text-nashville-400"
                }`}>
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-xl">{option.text}</h3>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedAnswer === option.value
                    ? "border-nashville-accent bg-nashville-accent text-white"
                    : "border-nashville-300"
                }`}>
                  {selectedAnswer === option.value && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
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

      <div className="flex justify-between items-center mt-8">
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
            disabled={
              (isMultiSelect ? getSelectedArray().length === 0 : !selectedAnswer)
            }
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
