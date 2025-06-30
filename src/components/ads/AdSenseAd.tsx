
import { useEffect, useRef } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AdSenseAd = ({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = '',
  style = {}
}: AdSenseAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Check if AdSense is loaded
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        ref={adRef}
      />
    </div>
  );
};

export default AdSenseAd;
