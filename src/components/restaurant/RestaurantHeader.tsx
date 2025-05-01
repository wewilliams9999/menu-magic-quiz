
import { ExternalLink } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { QuizResult } from "@/utils/quizData";

interface RestaurantHeaderProps {
  restaurant: QuizResult;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="font-serif text-xl">
        {restaurant.website ? (
          <a 
            href={restaurant.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
            aria-label={`Visit ${restaurant.name} website - Nashville Restaurant in ${restaurant.neighborhood}`}
            itemProp="url"
          >
            <span itemProp="name">{restaurant.name}</span>
            <ExternalLink className="h-3.5 w-3.5 inline-flex ml-1 opacity-70" aria-hidden="true" />
          </a>
        ) : (
          <span itemProp="name">{restaurant.name}</span>
        )}
      </CardTitle>
      <div className="text-sm text-muted-foreground">
        <span itemProp="areaServed">{restaurant.neighborhood}</span> • 
        <span itemProp="servesCuisine">{restaurant.cuisine}</span> • 
        <span itemProp="priceRange">{restaurant.priceRange}</span>
        {restaurant.address && (
          <div className="mt-1" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <span itemProp="streetAddress">{restaurant.address}</span>
            <meta itemProp="addressLocality" content="Nashville" />
            <meta itemProp="addressRegion" content="TN" />
            <meta itemProp="addressCountry" content="US" />
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default RestaurantHeader;
