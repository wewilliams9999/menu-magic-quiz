
import { useState } from 'react';
import { toast } from 'sonner';
import { UserLocation, convertCoordsToMapPosition } from '@/utils/mapCoordinates';

export const useLocationServices = (initialUserLocation?: {
  lat: number;
  lng: number;
} | null) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(
    initialUserLocation ? 
    {
      latitude: initialUserLocation.lat,
      longitude: initialUserLocation.lng,
      ...convertCoordsToMapPosition(initialUserLocation.lat, initialUserLocation.lng)
    } : null
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(!!initialUserLocation);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      position => {
        const { mapX, mapY } = convertCoordsToMapPosition(
          position.coords.latitude,
          position.coords.longitude
        );
        
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          mapX,
          mapY
        };
        
        setUserLocation(newLocation);
        setLocationEnabled(true);
        setIsLocating(false);
        toast.success("Your location has been found");
        
        console.log("User location:", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          mapX,
          mapY
        });
      }, 
      error => {
        setIsLocating(false);
        toast.error(`Unable to retrieve your location: ${error.message}`);
      }
    );
  };

  const disableLocation = () => {
    setUserLocation(null);
    setLocationEnabled(false);
    toast.info("Location services disabled");
  };

  return {
    userLocation,
    setUserLocation,
    isLocating,
    locationEnabled,
    getUserLocation,
    disableLocation
  };
};
