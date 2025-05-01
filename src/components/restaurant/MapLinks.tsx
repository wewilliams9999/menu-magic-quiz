
import { Button } from "@/components/ui/button";
import { Map, Navigation } from "lucide-react";
import { QuizResult } from "@/utils/quizData";

interface MapLinksProps {
  restaurant: QuizResult;
}

const MapLinks = ({ restaurant }: MapLinksProps) => {
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

  return (
    <>
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
    </>
  );
};

export default MapLinks;
