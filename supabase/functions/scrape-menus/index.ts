
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

interface ScrapeRequest {
  restaurantUrls: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { restaurantUrls }: ScrapeRequest = await req.json();
    console.log('Scraping restaurant URLs:', restaurantUrls);

    const scrapedData = [];

    for (const url of restaurantUrls) {
      try {
        console.log(`Scraping ${url}...`);
        
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

        if (!firecrawlResponse.ok) {
          console.error(`Failed to scrape ${url}:`, await firecrawlResponse.text());
          continue;
        }

        const result = await firecrawlResponse.json();
        console.log(`Successfully scraped ${url}`);
        
        if (result.data?.screenshot) {
          scrapedData.push({
            url: url,
            screenshot: result.data.screenshot,
            title: result.data.metadata?.title || 'Restaurant Menu',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        continue;
      }
    }

    console.log(`Successfully scraped ${scrapedData.length} menus`);

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
    console.error('Error in scrape-menus function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
