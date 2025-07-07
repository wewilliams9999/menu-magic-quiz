
import { supabase } from "@/integrations/supabase/client";

export interface ScrapedMenu {
  url: string;
  screenshot: string;
  title: string;
  timestamp: string;
}

export class MenuScrapingService {
  // Popular Nashville restaurant websites to scrape
  private static NASHVILLE_RESTAURANTS = [
    'https://hattieb.com',
    'https://princeshotchicken.com',
    'https://martinsbarbecuejoint.com',
    'https://thegulchnashville.com',
    'https://rolfandaughters.com',
    'https://thecatbirdseannashville.com',
    'https://thenoellehotel.com/dining',
    'https://southernground.com'
  ];

  static async scrapeNashvilleMenus(): Promise<{ success: boolean; data?: ScrapedMenu[]; error?: string }> {
    try {
      console.log('Starting menu scraping for Nashville restaurants...');
      
      const { data, error } = await supabase.functions.invoke('scrape-menus', {
        body: {
          restaurantUrls: this.NASHVILLE_RESTAURANTS.slice(0, 4) // Start with 4 to stay within free limits
        }
      });

      if (error) {
        console.error('Error calling scrape-menus function:', error);
        return { success: false, error: error.message };
      }

      if (!data.success) {
        console.error('Scraping failed:', data.error);
        return { success: false, error: data.error || 'Failed to scrape menus' };
      }

      console.log(`Successfully scraped ${data.count} menu screenshots`);
      return { success: true, data: data.data };

    } catch (error) {
      console.error('Exception in scrapeNashvilleMenus:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape menus' 
      };
    }
  }

  static getStorageKey(): string {
    return 'nashville_menu_screenshots';
  }

  static saveScrapedMenus(menus: ScrapedMenu[]): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(menus));
      console.log(`Saved ${menus.length} scraped menus to localStorage`);
    } catch (error) {
      console.error('Error saving scraped menus:', error);
    }
  }

  static getScrapedMenus(): ScrapedMenu[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const menus = JSON.parse(stored);
        console.log(`Retrieved ${menus.length} scraped menus from localStorage`);
        return menus;
      }
    } catch (error) {
      console.error('Error retrieving scraped menus:', error);
    }
    return [];
  }
}
