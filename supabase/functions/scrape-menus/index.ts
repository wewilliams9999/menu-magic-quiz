
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
          error: 'Firecrawl API key not configured in edge function secrets' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { restaurantUrls }: ScrapeRequest = await req.json();
    console.log('Received request to scrape URLs:', restaurantUrls);

    const scrapedData = [];

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

        if (!firecrawlResponse.ok) {
          const errorText = await firecrawlResponse.text();
          console.error(`Firecrawl API error for ${url}:`, errorText);
          continue;
        }

        const result = await firecrawlResponse.json();
        console.log(`Firecrawl result for ${url}:`, {
          hasScreenshot: !!result.data?.screenshot,
          title: result.data?.metadata?.title
        });
        
        if (result.data?.screenshot) {
          scrapedData.push({
            url: url,
            screenshot: result.data.screenshot,
            title: result.data.metadata?.title || 'Restaurant Menu',
            timestamp: new Date().toISOString()
          });
          console.log(`Successfully processed screenshot for ${url}`);
        } else {
          console.log(`No screenshot data returned for ${url}`);
        }
      } catch (error) {
        console.error(`Exception while scraping ${url}:`, error);
        continue;
      }
    }

    console.log(`=== Scraping completed. Successfully scraped ${scrapedData.length} menus ===`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: scrapedData,
        count: scrapedData.length 
      }),
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
        error: `Function error: ${error.message}` 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
