
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

  // Fallback placeholder menu images
  const fallbackMenuImages = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", // Chalkboard menu with text
    "https://images.unsplash.com/photo-1559847844-d72047d81e92?w=400&h=300&fit=crop", // Restaurant menu on table
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // Digital menu board display
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop", // Open menu pages
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", // Menu board on wall
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&h=300&fit=crop", // Menu with text visible
  ];

  // Auto-load menus on component mount
  useEffect(() => {
    const loadMenus = async () => {
      // First, try to get cached menus
      const stored = MenuScrapingService.getScrapedMenus();
      if (stored.length > 0) {
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
        } else {
          console.log('Failed to auto-load menus, using fallback images');
        }
      } catch (error) {
        console.error('Error auto-loading menus:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenus();
  }, []);

  // Use scraped menus if available, otherwise use fallback images
  const menuImages = scrapedMenus.length > 0 
    ? scrapedMenus.map(menu => `data:image/png;base64,${menu.screenshot}`)
    : fallbackMenuImages;

  if (!enabled) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Menu images collage */}
      {menuImages.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isLoading ? 0.03 : 0.08, scale: 1 }}
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
