
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/utils/quizData";

interface RestaurantCardProps {
  restaurant: QuizResult;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const hasReservationLinks = restaurant.resyLink || restaurant.openTableLink;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      {restaurant.isAlternative && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 text-sm text-yellow-800 dark:text-yellow-300">
          Alternative suggestion based on your preferences
        </div>
      )}
      
      {restaurant.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="font-serif text-xl">{restaurant.name}</CardTitle>
        <CardDescription>
          {restaurant.neighborhood} • {restaurant.cuisine} • {restaurant.priceRange}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-nashville-600 dark:text-nashville-400 mb-4">{restaurant.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {restaurant.features?.map((feature, index) => (
            <Badge key={index} variant="secondary" className="bg-nashville-100 dark:bg-nashville-800 text-nashville-700 dark:text-nashville-300">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        {restaurant.website && (
          <Button variant="outline" size="sm" asChild>
            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <span>Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        
        {restaurant.resyLink && (
          <Button variant="secondary" size="sm" asChild>
            <a href={restaurant.resyLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <span>Resy</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        
        {restaurant.openTableLink && (
          <Button variant="secondary" size="sm" asChild>
            <a href={restaurant.openTableLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <span>OpenTable</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        
        {!hasReservationLinks && (
          <p className="text-xs text-nashville-500 italic">Call restaurant for reservations</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;
