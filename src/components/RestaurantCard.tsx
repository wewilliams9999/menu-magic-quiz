
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
      coordinates: restaurant.coordinates
    });
  }, [restaurant]);
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-red-500/30"
      itemScope
      itemType="https://schema.org/Restaurant"
    >
      {restaurant.isAlternative && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 text-sm text-yellow-800 dark:text-yellow-300">
          Alternative suggestion based on your preferences
        </div>
      )}
      
      <ImageSection restaurant={restaurant} />
      <RestaurantHeader restaurant={restaurant} />
      <FeaturesList features={restaurant.features} />
      
      <CardFooter className="flex flex-wrap gap-2 justify-start mt-2">
        <RestaurantLinks restaurant={restaurant} />
        <MapLinks restaurant={restaurant} />
        
        {/* Schema.org metadata */}
        <meta itemProp="telephone" content={restaurant.phone || "Not available"} />
        <meta itemProp="description" content={`${restaurant.name} is a ${restaurant.priceRange} ${restaurant.cuisine} restaurant in the ${restaurant.neighborhood} area of Nashville.`} />
        <meta itemProp="geo" content={`Nashville, TN`} />
        <meta name="keywords" content={`Nashville restaurants, Nashville menus, ${restaurant.cuisine} restaurant Nashville, ${restaurant.neighborhood} restaurants Nashville, Best Nashville restaurants`} />
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;
