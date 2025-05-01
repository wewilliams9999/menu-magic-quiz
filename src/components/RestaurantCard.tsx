import { ExternalLink, Instagram, Map, Navigation } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/utils/quizData";
import { useState, useEffect } from "react";

interface RestaurantCardProps {
  restaurant: QuizResult;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
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
  
  // Generate map links for the restaurant
  const generateMapLinks = () => {
    const { name, address, coordinates } = restaurant;
    const encodedName = encodeURIComponent(name);
    let encodedAddress = address ? encodeURIComponent(address + ", Nashville, TN") : null;
    
    // Default to Nashville's coordinates if none provided
    const lat = coordinates?.latitude || 36.1627;
    const lng = coordinates?.longitude || -86.7816;
    
    // Generate Google Maps link
    let googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedName}`;
    if (encodedAddress) {
      googleMapsUrl += `+${encodedAddress}`;
    } else if (coordinates) {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
    
    // Generate Apple Maps link
    let appleMapsUrl = `https://maps.apple.com/?q=${encodedName}`;
    if (encodedAddress) {
      appleMapsUrl = `https://maps.apple.com/?address=${encodedAddress}&q=${encodedName}`;
    } else if (coordinates) {
      appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}&q=${encodedName}`;
    }
    
    return { googleMapsUrl, appleMapsUrl };
  };
  
  const { googleMapsUrl, appleMapsUrl } = generateMapLinks();
  
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

  // Debug log to check if links exist
  useEffect(() => {
    console.log(`Restaurant ${restaurant.name} links:`, {
      website: restaurant.website,
      instagram: restaurant.instagramLink,
      resy: restaurant.resyLink,
      openTable: restaurant.openTableLink,
      googleMaps: googleMapsUrl,
      appleMaps: appleMapsUrl
    });
  }, [restaurant, googleMapsUrl, appleMapsUrl]);
  
  // Check if any reservation links exist
  const hasReservationLinks = restaurant.resyLink || restaurant.openTableLink;
  
  // Check if address is available for map links
  const hasAddress = !!restaurant.address;
  
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
      
      <div className="relative h-48 w-full overflow-hidden bg-white flex items-center justify-center p-4">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={`${restaurant.name} - Nashville Restaurant in ${restaurant.neighborhood}`} 
            className="max-h-full max-w-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={handleImageError}
            itemProp="image"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
            <div className="text-lg font-serif" itemProp="name">{restaurant.name}</div>
            <div className="text-sm mt-2" itemProp="areaServed">{restaurant.neighborhood}</div>
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
      
      <CardContent>
        <div className="flex flex-wrap gap-2" itemProp="keywords">
          {restaurant.features?.map((feature, index) => (
            <Badge key={index} variant="secondary" className="bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 justify-start mt-2">
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
        
        {/* Google Maps button */}
        <Button variant="outline" size="sm" asChild className="border-blue-500 hover:border-blue-600 hover:bg-blue-50/50 text-blue-600 dark:border-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-950/30 dark:text-blue-400">
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1"
            aria-label={`View ${restaurant.name} on Google Maps - Nashville restaurant`}
          >
            <Map className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Google Maps</span>
          </a>
        </Button>
        
        {/* Apple Maps button */}
        <Button variant="outline" size="sm" asChild className="border-gray-500 hover:border-gray-600 hover:bg-gray-50/50 text-gray-600 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/30 dark:text-gray-400">
          <a 
            href={appleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1"
            aria-label={`View ${restaurant.name} on Apple Maps - Nashville restaurant`}
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Apple Maps</span>
          </a>
        </Button>
        
        {/* Reservation note */}
        {!hasReservationLinks && restaurant.website && (
          <p className="text-xs text-red-500 italic mt-1 w-full">Call restaurant for reservations</p>
        )}
        
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
