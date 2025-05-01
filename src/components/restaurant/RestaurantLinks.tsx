
import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram } from "lucide-react";
import { QuizResult } from "@/utils/quizData";

interface RestaurantLinksProps {
  restaurant: QuizResult;
}

const RestaurantLinks = ({ restaurant }: RestaurantLinksProps) => {
  const hasReservationLinks = restaurant.resyLink || restaurant.openTableLink;
  
  return (
    <>
      {/* Website button */}
      {restaurant.website && (
        <Button variant="outline" size="sm" asChild className="border-red-500 hover:border-red-600 hover:bg-red-50/50 text-red-600 dark:border-red-700 dark:hover:border-red-600 dark:hover:bg-red-950/30 dark:text-red-400">
          <a 
            href={restaurant.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1"
            aria-label={`Visit ${restaurant.name} website - Nashville restaurant`}
            itemProp="url"
          >
            <span>Website</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Button>
      )}
      
      {/* Instagram button */}
      {restaurant.instagramLink && (
        <Button variant="outline" size="sm" asChild className="border-red-500 hover:border-red-600 hover:bg-red-50/50 text-red-600 dark:border-red-700 dark:hover:border-red-600 dark:hover:bg-red-950/30 dark:text-red-400">
          <a 
            href={restaurant.instagramLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1"
            aria-label={`${restaurant.name} on Instagram - Nashville restaurant`}
            itemProp="sameAs"
          >
            <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Instagram</span>
          </a>
        </Button>
      )}
      
      {/* Resy reservation button */}
      {restaurant.resyLink && (
        <Button variant="secondary" size="sm" asChild className="bg-red-600/20 hover:bg-red-600/30 text-red-700 dark:bg-red-600/20 dark:hover:bg-red-600/30 dark:text-red-300">
          <a 
            href={restaurant.resyLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1"
            aria-label={`Make reservation for ${restaurant.name} on Resy - Nashville restaurant`}
          >
            <span className="font-bold">R</span>
            <span>Resy</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Button>
      )}
      
      {/* OpenTable reservation button */}
      {restaurant.openTableLink && (
        <Button variant="secondary" size="sm" asChild className="bg-red-600/20 hover:bg-red-600/30 text-red-700 dark:bg-red-600/20 dark:hover:bg-red-600/30 dark:text-red-300">
          <a 
            href={restaurant.openTableLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1"
            aria-label={`Make reservation for ${restaurant.name} on OpenTable - Nashville restaurant`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="12" cy="12" r="5"/>
            </svg>
            <span>OpenTable</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Button>
      )}
      
      {/* Reservation note */}
      {!hasReservationLinks && restaurant.website && (
        <p className="text-xs text-red-500 italic mt-1 w-full">Call restaurant for reservations</p>
      )}
    </>
  );
};

export default RestaurantLinks;
