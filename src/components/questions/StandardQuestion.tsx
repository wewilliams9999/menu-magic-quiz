
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { QuizOption } from "@/utils/quizData";

interface StandardQuestionProps {
  options: QuizOption[];
  selectedAnswer: string | null;
  onSelect: (value: string) => void;
}

const StandardQuestion = ({ options, selectedAnswer, onSelect }: StandardQuestionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
      {options.map((option, index) => (
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
            onClick={() => onSelect(option.value)}
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
  );
};

export default StandardQuestion;
