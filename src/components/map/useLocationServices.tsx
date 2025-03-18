
import { useState } from 'react';
import { toast } from 'sonner';
import { UserLocation, convertCoordsToMapPosition } from '@/utils/mapCoordinates';

export const useLocationServices = (initialUserLocation?: {
  lat: number;
  lng: number;
} | null, showToasts: boolean = true) => {
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
  const [toastShown, setToastShown] = useState(false);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      if (showToasts) {
        toast.error("Geolocation is not supported by your browser");
      }
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
        
        // Only show toast if showToasts is true and we haven't shown it yet
        if (showToasts && !toastShown) {
          toast.success("Your location has been found");
          setToastShown(true);
        }
        
        console.log("User location:", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          mapX,
          mapY
        });
      }, 
      error => {
        setIsLocating(false);
        if (showToasts) {
          toast.error(`Unable to retrieve your location: ${error.message}`);
        }
      }
    );
  };

  const disableLocation = () => {
    setUserLocation(null);
    setLocationEnabled(false);
    if (showToasts) {
      toast.info("Location services disabled");
    }
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
