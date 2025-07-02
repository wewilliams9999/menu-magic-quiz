
import { Button } from "@/components/ui/button";
import { Navigation, MapPin } from "lucide-react";
import { QuizResult } from "@/utils/quizData";

interface MapLinksProps {
  restaurant: QuizResult;
}

const MapLinks = ({ restaurant }: MapLinksProps) => {
  const generateMapLinks = () => {
    const { name, address, coordinates } = restaurant;
    const encodedName = encodeURIComponent(name);
    let encodedAddress = address ? encodeURIComponent(address + ", Nashville, TN") : null;
    
    const lat = coordinates?.latitude || 36.1627;
    const lng = coordinates?.longitude || -86.7816;
    
    let googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedName}`;
    if (encodedAddress) {
      googleMapsUrl += `+${encodedAddress}`;
    } else if (coordinates) {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
    
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
    <div className="flex gap-2">
      <Button variant="outline" size="sm" asChild>
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2"
          aria-label={`Get directions to ${restaurant.name}`}
        >
          <Navigation className="h-4 w-4" />
          <span>Directions</span>
        </a>
      </Button>
      
      <Button variant="outline" size="sm" asChild>
        <a 
          href={appleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2"
          aria-label={`View ${restaurant.name} on map`}
        >
          <MapPin className="h-4 w-4" />
          <span>Map</span>
        </a>
      </Button>
    </div>
  );
};

export default MapLinks;
