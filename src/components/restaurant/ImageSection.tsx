
import { useState, useEffect } from "react";
import { QuizResult } from "@/utils/quizData";

interface ImageSectionProps {
  restaurant: QuizResult;
}

const ImageSection = ({ restaurant }: ImageSectionProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(restaurant.logoUrl || restaurant.imageUrl || null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate a fallback image URL based on the restaurant website
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
  
  // Handle image loading errors
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
  
  return (
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
  );
};

export default ImageSection;
