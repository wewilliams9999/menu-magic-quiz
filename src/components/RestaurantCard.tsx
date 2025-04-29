
import { ExternalLink, Instagram } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/utils/quizData";
import { useState, useEffect } from "react";

interface RestaurantCardProps {
  restaurant: QuizResult;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const hasReservationLinks = restaurant.resyLink || restaurant.openTableLink;
  const [imageSrc, setImageSrc] = useState<string | null>(restaurant.logoUrl || restaurant.imageUrl || null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to generate a fallback image URL based on the restaurant website
  const generateWebsiteImageUrl = (website: string | undefined): string | null => {
    if (!website) return null;
    
    try {
      const url = new URL(website);
      return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url.origin}&size=128`;
    } catch (error) {
      console.error("Invalid URL:", website);
      return null;
    }
  };
  
  // Load a fallback image if the primary image fails
  const handleImageError = () => {
    if (restaurant.logoUrl && imageSrc === restaurant.logoUrl && restaurant.imageUrl) {
      // If logo fails, try the restaurant image
      console.log(`Logo failed for ${restaurant.name}, trying restaurant image`);
      setImageSrc(restaurant.imageUrl);
    } else if (restaurant.website) {
      // If both logo and image fail or aren't available, try website favicon
      console.log(`Images failed for ${restaurant.name}, trying website favicon`);
      const websiteImage = generateWebsiteImageUrl(restaurant.website);
      setImageSrc(websiteImage);
    } else {
      // If all else fails, set to null to show a placeholder
      setImageSrc(null);
    }
  };
  
  useEffect(() => {
    // Reset image source and loading state when restaurant changes
    setImageSrc(restaurant.logoUrl || restaurant.imageUrl || null);
    setIsLoading(true);
  }, [restaurant]);

  // Debug output to check if links are present
  console.log(`Restaurant ${restaurant.name} links:`, {
    website: restaurant.website,
    instagram: restaurant.instagramLink,
    resy: restaurant.resyLink,
    openTable: restaurant.openTableLink
  });
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-red-500/30">
      {restaurant.isAlternative && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 text-sm text-yellow-800 dark:text-yellow-300">
          Alternative suggestion based on your preferences
        </div>
      )}
      
      <div className="relative h-48 w-full overflow-hidden bg-white flex items-center justify-center p-4">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={restaurant.name} 
            className="max-h-full max-w-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
            <div className="text-lg font-serif">{restaurant.name}</div>
            <div className="text-sm mt-2">{restaurant.neighborhood}</div>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 h-24 w-36 rounded"></div>
          </div>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="font-serif text-xl">
          {restaurant.website ? (
            <a 
              href={restaurant.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
            >
              {restaurant.name}
              <ExternalLink className="h-3.5 w-3.5 inline-flex ml-1 opacity-70" />
            </a>
          ) : (
            restaurant.name
          )}
        </CardTitle>
        <CardDescription>
          {restaurant.neighborhood} • {restaurant.cuisine} • {restaurant.priceRange}
        </CardDescription>
        {restaurant.address && (
          <p className="text-sm text-muted-foreground mt-1">{restaurant.address}</p>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mt-2">
          {restaurant.features?.map((feature, index) => (
            <Badge key={index} variant="secondary" className="bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        {restaurant.website && (
          <Button variant="outline" size="sm" asChild className="border-red-500 hover:border-red-600 hover:bg-red-50/50 text-red-600 dark:border-red-700 dark:hover:border-red-600 dark:hover:bg-red-950/30 dark:text-red-400">
            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <span>Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        
        {restaurant.instagramLink && (
          <Button variant="outline" size="sm" asChild className="border-red-500 hover:border-red-600 hover:bg-red-50/50 text-red-600 dark:border-red-700 dark:hover:border-red-600 dark:hover:bg-red-950/30 dark:text-red-400">
            <a href={restaurant.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Instagram className="h-3.5 w-3.5" />
              <span>Instagram</span>
            </a>
          </Button>
        )}
        
        {restaurant.resyLink && (
          <Button variant="secondary" size="sm" asChild className="bg-red-600/20 hover:bg-red-600/30 text-red-700 dark:bg-red-600/20 dark:hover:bg-red-600/30 dark:text-red-300">
            <a href={restaurant.resyLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <span className="font-bold">R</span>
              <span>Resy</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        
        {restaurant.openTableLink && (
          <Button variant="secondary" size="sm" asChild className="bg-red-600/20 hover:bg-red-600/30 text-red-700 dark:bg-red-600/20 dark:hover:bg-red-600/30 dark:text-red-300">
            <a href={restaurant.openTableLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <circle cx="12" cy="12" r="5"/>
              </svg>
              <span>OpenTable</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        
        {!hasReservationLinks && restaurant.website && (
          <p className="text-xs text-red-500 italic">Call restaurant for reservations</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;
