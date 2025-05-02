
import { QuizResult } from "@/utils/quizData";
import RestaurantCard from "@/components/RestaurantCard";

interface ResultsGridProps {
  results: QuizResult[];
}

const ResultsGrid = ({ results }: ResultsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((result) => (
        <RestaurantCard key={result.id} restaurant={result} />
      ))}
    </div>
  );
};

export default ResultsGrid;
