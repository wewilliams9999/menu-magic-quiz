
import { supabase } from "@/integrations/supabase/client";

export interface ScrapedMenu {
  url: string;
  screenshot: string;
  title: string;
  timestamp: string;
}

export class MenuScrapingService {
  // Popular Nashville restaurant websites to scrape - updated with more reliable URLs
  private static NASHVILLE_RESTAURANTS = [
    'https://hattieb.com',
    'https://princeshotchicken.com',
    'https://thegulchnashville.com',
    // Temporarily removing martinsbarbecuejoint.com due to DNS issues
    'https://www.lovelesscafe.com'
  ];

  static async scrapeNashvilleMenus(): Promise<{ success: boolean; data?: ScrapedMenu[]; error?: string }> {
    try {
      console.log('=== MenuScrapingService: Starting scraping process ===');
      
      const { data, error } = await supabase.functions.invoke('scrape-menus', {
        body: {
          restaurantUrls: this.NASHVILLE_RESTAURANTS
        }
      });

      console.log('Supabase function invoke result:', { data, error });

      if (error) {
        console.error('Supabase function invoke error:', error);
        return { success: false, error: `Function call failed: ${error.message}` };
      }

      if (!data) {
        console.error('No data returned from function');
        return { success: false, error: 'No data returned from scraping function' };
      }

      // Handle the response - even if some URLs failed, we consider it success if we got any data
      if (data.success === true && data.data && data.data.length > 0) {
        console.log(`=== MenuScrapingService: Successfully scraped ${data.count} menus ===`);
        if (data.errors && data.errors.length > 0) {
          console.warn('Some URLs failed to scrape:', data.errors);
        }
        return { success: true, data: data.data };
      } else {
        // If no data was scraped successfully, return the error info
        const errorMsg = data.error || 
          (data.errors && data.errors.length > 0 ? data.errors.join(', ') : 'No menus could be scraped');
        
        console.error('No menus were successfully scraped:', errorMsg);
        return { 
          success: false, 
          error: errorMsg
        };
      }

    } catch (error) {
      console.error('=== MenuScrapingService: Exception occurred ===', error);
      return { 
        success: false, 
        error: `Service error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  static getStorageKey(): string {
    return 'nashville_menu_screenshots';
  }

  static saveScrapedMenus(menus: ScrapedMenu[]): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(menus));
      console.log(`MenuScrapingService: Saved ${menus.length} scraped menus to localStorage`);
    } catch (error) {
      console.error('MenuScrapingService: Error saving scraped menus:', error);
    }
  }

  static getScrapedMenus(): ScrapedMenu[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const menus = JSON.parse(stored);
        console.log(`MenuScrapingService: Retrieved ${menus.length} scraped menus from localStorage`);
        return menus;
      }
    } catch (error) {
      console.error('MenuScrapingService: Error retrieving scraped menus:', error);
    }
    return [];
  }
}
