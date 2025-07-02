
import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram, Star, Menu, Phone } from "lucide-react";
import { QuizResult } from "@/utils/quizData";

interface RestaurantLinksProps {
  restaurant: QuizResult;
}

const RestaurantLinks = ({ restaurant }: RestaurantLinksProps) => {
  const hasReservationLinks = restaurant.resyLink || restaurant.openTableLink;
  
  return (
    <div className="flex flex-col gap-3">
      {/* Primary Actions Row */}
      <div className="flex flex-wrap gap-2">
        {/* Primary CTA - Make Reservation (if available) */}
        {restaurant.resyLink && (
          <Button size="sm" asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold flex-1 min-w-[140px]">
            <a 
              href={restaurant.resyLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2"
              aria-label={`Make reservation for ${restaurant.name} on Resy - Nashville restaurant`}
            >
              <span>Make Reservation</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        )}
        
        {/* Primary CTA - OpenTable reservation */}
        {restaurant.openTableLink && !restaurant.resyLink && (
          <Button size="sm" asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold flex-1 min-w-[140px]">
            <a 
              href={restaurant.openTableLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2"
              aria-label={`Make reservation for ${restaurant.name} on OpenTable - Nashville restaurant`}
            >
              <span>Make Reservation</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        )}

        {/* View Menu / Visit Website button */}
        {restaurant.website && (
          <Button variant="outline" size="sm" asChild className="border-red-500 hover:border-red-600 hover:bg-red-50/50 text-red-600 dark:border-red-700 dark:hover:border-red-600 dark:hover:bg-red-950/30 dark:text-red-400 font-medium flex-1 min-w-[100px]">
            <a 
              href={restaurant.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2"
              aria-label={`View menu and website for ${restaurant.name} - Nashville restaurant`}
              itemProp="url"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              <span>View Menu</span>
            </a>
          </Button>
        )}
      </div>

      {/* Secondary Actions Row */}
      <div className="flex flex-wrap gap-2">
        {/* Instagram - Social proof */}
        {restaurant.instagramLink && (
          <Button variant="outline" size="sm" asChild className="border-pink-500 hover:border-pink-600 hover:bg-pink-50/50 text-pink-600 dark:border-pink-700 dark:hover:border-pink-600 dark:hover:bg-pink-950/30 dark:text-pink-400">
            <a 
              href={restaurant.instagramLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2"
              aria-label={`Follow ${restaurant.name} on Instagram - Nashville restaurant`}
              itemProp="sameAs"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              <span>Follow</span>
            </a>
          </Button>
        )}
        
        {/* Call to action for reviews */}
        <Button variant="ghost" size="sm" asChild className="text-amber-600 hover:text-amber-700 hover:bg-amber-50/50 dark:text-amber-400 dark:hover:bg-amber-950/30">
          <a 
            href={`https://www.google.com/search?q=${encodeURIComponent(restaurant.name + " Nashville reviews")}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2"
            aria-label={`Read reviews for ${restaurant.name} - Nashville restaurant`}
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            <span>Reviews</span>
          </a>
        </Button>

        {/* Phone number if available */}
        {restaurant.phone && (
          <Button variant="ghost" size="sm" asChild className="text-green-600 hover:text-green-700 hover:bg-green-50/50 dark:text-green-400 dark:hover:bg-green-950/30">
            <a 
              href={`tel:${restaurant.phone}`}
              className="flex items-center gap-2"
              aria-label={`Call ${restaurant.name} at ${restaurant.phone}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>Call</span>
            </a>
          </Button>
        )}
      </div>
      
      {/* Reservation note for restaurants without online booking */}
      {!hasReservationLinks && restaurant.website && (
        <p className="text-xs text-red-500 italic mt-1">📞 Call for reservations</p>
      )}
    </div>
  );
};

export default RestaurantLinks;
