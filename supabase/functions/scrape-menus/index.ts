
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

interface ScrapeRequest {
  restaurantUrls: string[];
  storeInDb?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('=== Scrape Menus Function Started ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    console.log('FIRECRAWL_API_KEY check:', firecrawlApiKey ? 'Present' : 'Missing');
    
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Firecrawl API key not configured in edge function secrets',
          data: [],
          count: 0
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { restaurantUrls, storeInDb }: ScrapeRequest = await req.json();
    console.log('Received request to scrape URLs:', restaurantUrls, 'Store in DB:', storeInDb);

    // Initialize Supabase client if we need to store in DB
    let supabase = null;
    if (storeInDb) {
      supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
    }

    const scrapedData = [];
    const errors = [];

    for (const url of restaurantUrls) {
      try {
        console.log(`Starting scrape for: ${url}`);
        
        // Call Firecrawl API to scrape the website with improved settings
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            formats: ['screenshot'],
            waitFor: 3000,
            timeout: 30000,
            mobile: false,
            actions: [
              {
                type: 'wait',
                milliseconds: 3000
              }
            ]
          })
        });

        console.log(`Firecrawl API response status for ${url}:`, firecrawlResponse.status);

        // Handle rate limiting specifically
        if (firecrawlResponse.status === 429) {
          const errorText = await firecrawlResponse.text();
          console.warn(`Rate limit hit for ${url}:`, errorText);
          errors.push(`${url}: Rate limit exceeded - please try again later`);
          continue;
        }

        if (!firecrawlResponse.ok) {
          const errorText = await firecrawlResponse.text();
          console.error(`Firecrawl API error for ${url}:`, errorText);
          errors.push(`${url}: HTTP ${firecrawlResponse.status} - ${errorText}`);
          continue;
        }

        const result = await firecrawlResponse.json();
        console.log(`Firecrawl result for ${url}:`, {
          hasScreenshot: !!result.data?.screenshot,
          title: result.data?.metadata?.title,
          success: result.success
        });
        
        // Handle new Firecrawl v1 API response format
        if (result.success && result.data?.screenshot) {
          scrapedData.push({
            url: url,
            screenshot: result.data.screenshot,
            title: result.data.metadata?.title || 'Restaurant Menu',
            timestamp: new Date().toISOString()
          });
          console.log(`Successfully processed screenshot for ${url}`);
        } else {
          console.log(`No screenshot data returned for ${url}:`, result.error || 'Unknown error');
          errors.push(`${url}: ${result.error || 'No screenshot data'}`);
        }
      } catch (error) {
        console.error(`Exception while scraping ${url}:`, error);
        errors.push(`${url}: ${error.message}`);
        continue;
      }
    }

    console.log(`=== Scraping completed. Successfully scraped ${scrapedData.length} menus ===`);
    if (errors.length > 0) {
      console.log('Errors encountered:', errors);
    }

    // Store in database if requested and we have data
    if (storeInDb && supabase && scrapedData.length > 0) {
      console.log('Storing scraped menus in database...');
      
      // Clear old data first (keep only latest scraping)
      const { error: deleteError } = await supabase
        .from('scraped_menus')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) {
        console.warn('Error clearing old menu data:', deleteError);
      }

      // Insert new data
      const { error: insertError } = await supabase
        .from('scraped_menus')
        .insert(scrapedData.map(menu => ({
          url: menu.url,
          screenshot: menu.screenshot,
          title: menu.title
        })));

      if (insertError) {
        console.error('Error storing menus in database:', insertError);
      } else {
        console.log(`Successfully stored ${scrapedData.length} menus in database`);
      }
    }

    // Always return success=true if we have ANY data, or success=false with helpful error info
    const response = {
      success: scrapedData.length > 0,
      data: scrapedData,
      count: scrapedData.length,
      errors: errors.length > 0 ? errors : undefined,
      message: scrapedData.length > 0 
        ? `Successfully scraped ${scrapedData.length} restaurant menus` 
        : 'No menus were successfully scraped'
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('=== Error in scrape-menus function ===', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: `Function error: ${error.message}`,
        data: [],
        count: 0
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
