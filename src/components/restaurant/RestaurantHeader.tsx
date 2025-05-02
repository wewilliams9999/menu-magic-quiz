
import { QuizResult } from "@/utils/quizData";
import { CardHeader } from "@/components/ui/card";

interface RestaurantHeaderProps {
  restaurant: QuizResult;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  // Format the distance to show one decimal place
  const formattedDistance = restaurant.distanceFromUser 
    ? `${restaurant.distanceFromUser.toFixed(1)} mi` 
    : null;
    
  return (
    <CardHeader className="p-4 pb-2">
      <div className="flex flex-wrap justify-between items-start">
        <div>
          <h3 
            className="text-xl font-bold mb-1 text-red-500" 
            itemProp="name"
          >
            {restaurant.name}
          </h3>
          
          <div className="text-sm text-zinc-400 mb-1" itemProp="servesCuisine">
            {restaurant.cuisine} • {restaurant.priceRange}
          </div>
          
          <div className="text-sm text-zinc-500" itemProp="address">
            {restaurant.neighborhood}
            {formattedDistance && (
              <span className="ml-2">• <span className={restaurant.isAlternative ? "text-amber-400" : "text-zinc-400"}>
                {formattedDistance}
              </span></span>
            )}
          </div>
        </div>
        
        {restaurant.logoUrl && (
          <div className="w-12 h-12 overflow-hidden flex items-center justify-center bg-white/10 rounded-md">
            <img 
              src={restaurant.logoUrl} 
              alt={`${restaurant.name} logo`} 
              className="w-auto h-auto max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default RestaurantHeader;
