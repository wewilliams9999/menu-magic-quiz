
import { motion } from "framer-motion";
import { Check, Utensils } from "lucide-react";
import { QuizOption } from "@/utils/quizData";

interface CuisineQuestionProps {
  options: QuizOption[];
  selectedAnswer: string | null;
  onSelect: (value: string) => void;
}

const CuisineQuestion = ({ options, selectedAnswer, onSelect }: CuisineQuestionProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-12">
      {options.map((option, index) => (
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
            onClick={() => onSelect(option.value)}
            className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
              selectedAnswer === option.value 
                ? "bg-gradient-to-r from-orange-500/20 to-orange-500/5 border-l-4 border-orange-500" 
                : "bg-divebar-dark/40 hover:bg-divebar-dark/60 border-l-4 border-transparent"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              selectedAnswer === option.value
                ? "bg-orange-500 text-divebar-dark"
                : "bg-divebar-brick text-zinc-400"
            }`}>
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-xl text-zinc-200">{option.text}</h3>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedAnswer === option.value
                ? "border-orange-500 bg-orange-500/20 text-orange-400"
                : "border-zinc-600"
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
  );
};

export default CuisineQuestion;
