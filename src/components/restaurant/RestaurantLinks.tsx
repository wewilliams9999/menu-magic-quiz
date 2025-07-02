
import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram, Star, Menu, Phone } from "lucide-react";
import { QuizResult } from "@/utils/quizData";

interface RestaurantLinksProps {
  restaurant: QuizResult;
}

const RestaurantLinks = ({ restaurant }: RestaurantLinksProps) => {
  const hasReservationLinks = restaurant.resyLink || restaurant.openTableLink;
  
  return (
    <div className="flex flex-wrap gap-2">
      {/* Website/Menu Link */}
      {restaurant.website && (
        <Button variant="outline" size="sm" asChild>
          <a 
            href={restaurant.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2"
            aria-label={`Visit ${restaurant.name} website`}
            itemProp="url"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Website</span>
          </a>
        </Button>
      )}

      {/* Reservation Links */}
      {restaurant.resyLink && (
        <Button variant="outline" size="sm" asChild>
          <a 
            href={restaurant.resyLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2"
            aria-label={`Make reservation at ${restaurant.name} via Resy`}
          >
            <span>Resy</span>
          </a>
        </Button>
      )}
      
      {restaurant.openTableLink && (
        <Button variant="outline" size="sm" asChild>
          <a 
            href={restaurant.openTableLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2"
            aria-label={`Make reservation at ${restaurant.name} via OpenTable`}
          >
            <span>OpenTable</span>
          </a>
        </Button>
      )}

      {/* Instagram */}
      {restaurant.instagramLink && (
        <Button variant="outline" size="sm" asChild>
          <a 
            href={restaurant.instagramLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2"
            aria-label={`Follow ${restaurant.name} on Instagram`}
            itemProp="sameAs"
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </a>
        </Button>
      )}

      {/* Phone */}
      {restaurant.phone && (
        <Button variant="outline" size="sm" asChild>
          <a 
            href={`tel:${restaurant.phone}`}
            className="flex items-center gap-2"
            aria-label={`Call ${restaurant.name}`}
          >
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </a>
        </Button>
      )}
    </div>
  );
};

export default RestaurantLinks;
