
import { Card, CardFooter } from "@/components/ui/card";
import { QuizResult } from "@/utils/quizData";
import { useEffect } from "react";

// Import our newly created components
import ImageSection from "./restaurant/ImageSection";
import RestaurantHeader from "./restaurant/RestaurantHeader";
import FeaturesList from "./restaurant/FeaturesList";
import RestaurantLinks from "./restaurant/RestaurantLinks";
import MapLinks from "./restaurant/MapLinks";

interface RestaurantCardProps {
  restaurant: QuizResult;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  // Debug log to check if links exist
  useEffect(() => {
    console.log(`Restaurant ${restaurant.name} links:`, {
      website: restaurant.website,
      instagram: restaurant.instagramLink,
      resy: restaurant.resyLink,
      openTable: restaurant.openTableLink,
      coordinates: restaurant.coordinates,
      distance: restaurant.distanceFromUser ? `${restaurant.distanceFromUser.toFixed(1)} mi` : 'Unknown',
      phone: restaurant.phone
    });
  }, [restaurant]);
  
  return (
    <Card 
      className={`h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md hover:border-red-500/30 ${
        restaurant.isAlternative ? 'border-amber-500/30' : ''
      }`}
      itemScope
      itemType="https://schema.org/Restaurant"
    >
      {restaurant.isAlternative && (
        <div className="bg-amber-950/50 dark:bg-amber-900/30 px-4 py-2 text-sm text-amber-400">
          Outside your distance preference but matches other criteria
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <ImageSection restaurant={restaurant} />
        <div className="flex-1 flex flex-col">
          <RestaurantHeader restaurant={restaurant} />
          <FeaturesList features={restaurant.features} />
        </div>
        
        <CardFooter className="flex flex-wrap gap-2 justify-start mt-auto p-4">
          <RestaurantLinks restaurant={restaurant} />
          <MapLinks restaurant={restaurant} />
          
          {/* Schema.org metadata */}
          <meta itemProp="telephone" content={restaurant.phone || "Not available"} />
          <meta itemProp="description" content={`${restaurant.name} is a ${restaurant.priceRange} ${restaurant.cuisine} restaurant in the ${restaurant.neighborhood} area of Nashville.`} />
          <meta itemProp="geo" content={`Nashville, TN`} />
          <meta name="keywords" content={`Nashville restaurants, Nashville menus, ${restaurant.cuisine} restaurant Nashville, ${restaurant.neighborhood} restaurants Nashville, Best Nashville restaurants`} />
        </CardFooter>
      </div>
    </Card>
  );
};

export default RestaurantCard;
