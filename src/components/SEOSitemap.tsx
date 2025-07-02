
// This component generates sitemap data for Nashville restaurant pages
export const generateSitemapUrls = () => {
  const baseUrl = "https://nashmenus.com";
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/quiz`,
      lastmod: currentDate,
      changefreq: 'weekly', 
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/welcome`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    }
  ];

  // Add neighborhood-specific pages for SEO
  const neighborhoods = [
    'music-city-center',
    'the-gulch', 
    'green-hills',
    'belle-meade',
    'east-nashville',
    'bellevue',
    'downtown-nashville',
    'midtown-nashville'
  ];

  neighborhoods.forEach(neighborhood => {
    urls.push({
      loc: `${baseUrl}/restaurants/${neighborhood}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    });
  });

  return urls;
};

// SEO-friendly restaurant categories
export const restaurantCategories = {
  'best-nashville-restaurants': {
    title: 'Best Nashville Restaurants 2025',
    description: 'Discover the top-rated restaurants in Nashville, from iconic hot chicken spots to fine dining establishments.',
    keywords: 'best Nashville restaurants, top Nashville dining, Nashville restaurant guide'
  },
  'nashville-hot-chicken': {
    title: 'Best Hot Chicken in Nashville',
    description: 'Find the best Nashville hot chicken restaurants, from Prince\'s to Hattie B\'s and hidden local gems.',
    keywords: 'Nashville hot chicken, best hot chicken Nashville, Prince\'s hot chicken'
  },
  'nashville-bbq': {
    title: 'Best BBQ Restaurants in Nashville',
    description: 'Discover Nashville\'s top barbecue spots serving authentic Tennessee BBQ and Southern flavors.',
    keywords: 'Nashville BBQ, Nashville barbecue, Tennessee BBQ restaurants'
  },
  'fine-dining-nashville': {
    title: 'Fine Dining Restaurants in Nashville',
    description: 'Experience Nashville\'s upscale restaurant scene with our guide to the city\'s best fine dining establishments.',
    keywords: 'Nashville fine dining, upscale Nashville restaurants, Nashville steakhouse'
  }
};
