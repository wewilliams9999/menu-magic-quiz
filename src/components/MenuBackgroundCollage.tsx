
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

  useEffect(() => {
    const loadMenus = async () => {
      if (!enabled) return;
      
      console.log('MenuBackgroundCollage: Loading cached menus...');
      setIsLoading(true);
      setError(null);

      try {
        // Load cached menus from database (populated by daily cron job)
        const cachedResult = await MenuScrapingService.loadCachedMenus();
        
        if (cachedResult.success && cachedResult.data && cachedResult.data.length > 0) {
          console.log('MenuBackgroundCollage: Loaded cached menus successfully');
          setScrapedMenus(cachedResult.data);
          setIsLoading(false);
          return;
        }

        // If no cached menus, trigger initial scrape (one-time setup)
        console.log('MenuBackgroundCollage: No cached menus found, triggering initial scrape...');
        const scrapeResult = await MenuScrapingService.scrapeNashvilleMenus();
        
        if (scrapeResult.success && scrapeResult.data && scrapeResult.data.length > 0) {
          setScrapedMenus(scrapeResult.data);
          console.log('MenuBackgroundCollage: Initial scrape completed successfully');
        } else {
          console.log('MenuBackgroundCollage: Scraping failed, will retry on next visit');
          // Don't show error to user - just show clean background
        }
      } catch (error) {
        console.error('MenuBackgroundCollage: Error loading menus:', error);
        // Don't show error to user - just show clean background
      } finally {
        setIsLoading(false);
      }
    };

    loadMenus();
  }, [enabled]);

  // Show loading state or error state
  if (!enabled) {
    console.log('Component disabled, returning null');
    return null;
  }

  // Use scraped menu screenshots
  const menuImages = scrapedMenus.length > 0 
    ? scrapedMenus.map(menu => `data:image/png;base64,${menu.screenshot}`)
    : [];

  console.log('MenuBackgroundCollage Rendering with:', { 
    isLoading, 
    error, 
    menuImagesCount: menuImages.length,
    scrapedMenusCount: scrapedMenus.length,
    scrapedMenus: scrapedMenus.map(m => ({ url: m.url, hasScreenshot: !!m.screenshot }))
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

      {/* Hide error indicators - show clean background */}

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
