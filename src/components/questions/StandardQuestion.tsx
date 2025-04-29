
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
            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(255, 120, 0, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect(option.value)}
            className={`option-card relative overflow-hidden rounded-lg border ${
              selectedAnswer === option.value 
                ? "neon-box bg-divebar-dark/70" 
                : "border-zinc-700/50 bg-divebar-dark/40 hover:border-orange-800/50"
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
                <h3 className="font-medium text-lg text-zinc-200">{option.text}</h3>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedAnswer === option.value
                  ? "border-orange-500 bg-orange-500/20"
                  : "border-zinc-600"
              }`}>
                {selectedAnswer === option.value && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-orange-400"
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
                className="absolute inset-0 border-2 border-orange-500 rounded-lg pointer-events-none box-glow"
              />
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default StandardQuestion;
