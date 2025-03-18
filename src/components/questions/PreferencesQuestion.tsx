
import { Utensils, XCircle, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuizOption } from "@/utils/quizData";

interface PreferencesQuestionProps {
  options: QuizOption[];
  selectedAnswers: string[];
  onSelect: (values: string[]) => void;
}

const PreferencesQuestion = ({ options, selectedAnswers, onSelect }: PreferencesQuestionProps) => {
  const handleMultiSelectChange = (id: string, checked: boolean) => {
    if (id === 'none' && checked) {
      onSelect(['none']);
      return;
    } else if (checked && selectedAnswers.includes('none')) {
      const newSelection = selectedAnswers.filter(item => item !== 'none');
      onSelect([...newSelection, id]);
      return;
    }
    
    if (checked) {
      onSelect([...selectedAnswers, id]);
    } else {
      onSelect(selectedAnswers.filter(item => item !== id));
    }
  };

  const getPreferenceIcon = (value: string) => {
    switch (value) {
      case 'none':
        return <XCircle className="w-5 h-5" />;
      case 'vegetarian':
      case 'vegan':
        return <Utensils className="w-5 h-5" />;
      case 'gluten-free':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Utensils className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-nashville-200 dark:border-nashville-800 shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => (
          <div 
            key={option.id}
            className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-nashville-100/50 dark:hover:bg-nashville-800/50 transition-colors ${option.value === 'none' ? 'col-span-1 sm:col-span-2 border-t border-dashed border-nashville-200 dark:border-nashville-700 mt-2 pt-4' : ''}`}
          >
            <Checkbox 
              id={option.id}
              checked={selectedAnswers.includes(option.value)}
              onCheckedChange={(checked) => {
                handleMultiSelectChange(option.value, checked === true);
              }}
              className="mt-1 data-[state=checked]:bg-nashville-accent data-[state=checked]:border-nashville-accent"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <div className={`text-nashville-accent ${selectedAnswers.includes(option.value) ? 'opacity-100' : 'opacity-70'}`}>
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
  );
};

export default PreferencesQuestion;
