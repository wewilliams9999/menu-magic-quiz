
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

interface ScrapeRequest {
  restaurantUrls: string[];
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

    const { restaurantUrls }: ScrapeRequest = await req.json();
    console.log('Received request to scrape URLs:', restaurantUrls);

    const scrapedData = [];
    const errors = [];

    for (const url of restaurantUrls) {
      try {
        console.log(`Starting scrape for: ${url}`);
        
        // Call Firecrawl API to scrape the website
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            formats: ['screenshot'],
            screenshot: true,
            waitFor: 2000
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
