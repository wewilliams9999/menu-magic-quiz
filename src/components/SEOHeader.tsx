
import { Helmet } from "react-helmet-async";

interface SEOHeaderProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const SEOHeader = ({ 
  title = "Best Nashville Restaurants 2025 | Nash Menus Restaurant Guide",
  description = "Find the best Nashville restaurants with our expert guide. Discover top-rated Nashville dining spots by neighborhood, cuisine, and price. Your ultimate Nashville food finder.",
  keywords = "Nashville restaurants, best Nashville restaurants, Nashville dining guide, Nashville food, Nashville restaurant finder",
  canonicalUrl = "https://nashmenus.com",
  ogImage = "/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png"
}: SEOHeaderProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHeader;
