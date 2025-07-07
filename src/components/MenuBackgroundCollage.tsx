
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MenuScrapingService, ScrapedMenu } from "@/services/menuScrapingService";
import { useToast } from "@/hooks/use-toast";

interface MenuBackgroundCollageProps {
  enabled?: boolean;
}

const MenuBackgroundCollage = ({ enabled = true }: MenuBackgroundCollageProps) => {
  const [scrapedMenus, setScrapedMenus] = useState<ScrapedMenu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Auto-load menus on component mount
  useEffect(() => {
    const loadMenus = async () => {
      console.log('=== MenuBackgroundCollage: Starting menu load process ===');
      
      // First, try to get cached menus
      const stored = MenuScrapingService.getScrapedMenus();
      console.log('Cached menus found:', stored.length);
      
      if (stored.length > 0) {
        console.log(`Using ${stored.length} cached menu screenshots`);
        setScrapedMenus(stored);
        return;
      }

      // If no cached menus, scrape new ones automatically
      console.log('No cached menus found, starting scraping process...');
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Calling MenuScrapingService.scrapeNashvilleMenus()...');
        const result = await MenuScrapingService.scrapeNashvilleMenus();
        console.log('Scraping result:', result);
        
        if (result.success && result.data) {
          console.log(`Successfully scraped ${result.data.length} menus`);
          setScrapedMenus(result.data);
          MenuScrapingService.saveScrapedMenus(result.data);
          
          toast({
            title: "Success!",
            description: `Loaded ${result.data.length} real Nashville restaurant menus`,
            duration: 4000,
          });
        } else {
          const errorMsg = result.error || 'Unknown error during scraping';
          console.error('Scraping failed:', errorMsg);
          setError(errorMsg);
          
          toast({
            title: "Failed to load real menus",
            description: errorMsg,
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Exception during menu scraping:', error);
        setError(errorMsg);
        
        toast({
          title: "Error loading menus",
          description: errorMsg,
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
        console.log('=== MenuBackgroundCollage: Menu load process completed ===');
      }
    };

    if (enabled) {
      console.log('MenuBackgroundCollage enabled, starting load process');
      loadMenus();
    } else {
      console.log('MenuBackgroundCollage disabled, skipping load');
    }
  }, [enabled, toast]);

  // Show loading state or error state
  if (!enabled) {
    console.log('Component disabled, returning null');
    return null;
  }

  // Use scraped menu screenshots
  const menuImages = scrapedMenus.length > 0 
    ? scrapedMenus.map(menu => `data:image/png;base64,${menu.screenshot}`)
    : [];

  console.log('Rendering with:', { 
    isLoading, 
    error, 
    menuImagesCount: menuImages.length,
    scrapedMenusCount: scrapedMenus.length 
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Menu images collage - only show if we have real menus */}
      {menuImages.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ delay: index * 0.2, duration: 1 }}
          className="absolute"
          style={{
            left: `${(index % 3) * 35 + 10}%`,
            top: `${Math.floor(index / 3) * 40 + 15}%`,
            transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (5 + index * 2)}deg)`,
          }}
        >
          <div
            className="w-48 h-36 bg-cover bg-center rounded-lg shadow-lg"
            style={{
              backgroundImage: `url(${image})`,
              filter: 'sepia(0.3) contrast(0.8) brightness(0.9)',
            }}
          />
        </motion.div>
      ))}
      
      {/* Status indicators */}
      {scrapedMenus.length > 0 && (
        <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
          <div className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 text-green-300 text-xs">
            Real Nashville Menus ✓ ({scrapedMenus.length})
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 text-orange-300 text-xs animate-pulse">
            Loading Nashville Menus...
          </div>
        </div>
      )}

      {/* Error indicator */}
      {error && !isLoading && (
        <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
          <div className="bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1 text-red-300 text-xs">
            Error: {error}
          </div>
        </div>
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-30 pointer-events-none">
          <div className="bg-gray-500/20 border border-gray-500/30 rounded px-2 py-1 text-gray-300 text-xs">
            Debug: Loading={isLoading.toString()}, Menus={scrapedMenus.length}, Error={error ? 'Yes' : 'No'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBackgroundCollage;
