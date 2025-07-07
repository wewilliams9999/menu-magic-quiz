
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
  const { toast } = useToast();

  // Auto-load menus on component mount
  useEffect(() => {
    const loadMenus = async () => {
      // First, try to get cached menus
      const stored = MenuScrapingService.getScrapedMenus();
      if (stored.length > 0) {
        console.log(`Found ${stored.length} cached menu screenshots`);
        setScrapedMenus(stored);
        return;
      }

      // If no cached menus, scrape new ones automatically
      setIsLoading(true);
      try {
        console.log('Auto-loading Nashville restaurant menus...');
        const result = await MenuScrapingService.scrapeNashvilleMenus();
        
        if (result.success && result.data) {
          setScrapedMenus(result.data);
          MenuScrapingService.saveScrapedMenus(result.data);
          console.log(`Auto-loaded ${result.data.length} Nashville restaurant menus`);
          
          toast({
            title: "Success!",
            description: `Loaded ${result.data.length} real Nashville restaurant menus`,
            duration: 4000,
          });
        } else {
          console.error('Failed to auto-load menus:', result.error);
          toast({
            title: "Couldn't load real menus",
            description: "Using placeholder images for now. Will retry next time.",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error auto-loading menus:', error);
        toast({
          title: "Error loading menus",
          description: "Check console for details. Using placeholders for now.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (enabled) {
      loadMenus();
    }
  }, [enabled, toast]);

  // Only show background if we have real scraped menus OR if we're loading
  // Don't show fallback images - either show real menus or nothing
  if (!enabled || (scrapedMenus.length === 0 && !isLoading)) {
    return null;
  }

  // Use scraped menu screenshots
  const menuImages = scrapedMenus.length > 0 
    ? scrapedMenus.map(menu => `data:image/png;base64,${menu.screenshot}`)
    : [];

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
      
      {/* Status indicator - only show when real menus are loaded */}
      {scrapedMenus.length > 0 && (
        <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
          <div className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 text-green-300 text-xs">
            Real Nashville Menus ✓
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
    </div>
  );
};

export default MenuBackgroundCollage;
