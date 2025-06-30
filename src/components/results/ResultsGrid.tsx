
import { QuizResult } from "@/utils/quiz/types";
import RestaurantCard from "@/components/RestaurantCard";
import NativeAd from "@/components/ads/NativeAd";

interface ResultsGridProps {
  results: QuizResult[];
}

const ResultsGrid = ({ results }: ResultsGridProps) => {
  const renderWithAds = () => {
    const items = [];
    
    results.forEach((result, index) => {
      items.push(
        <RestaurantCard key={result.id} restaurant={result} />
      );
      
      // Insert ad after every 3rd restaurant (but not after the last one)
      if ((index + 1) % 3 === 0 && index < results.length - 1) {
        items.push(
          <div key={`ad-${index}`} className="md:col-span-2">
            <NativeAd />
          </div>
        );
      }
    });
    
    return items;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderWithAds()}
    </div>
  );
};

export default ResultsGrid;
