
import AdSenseAd from './AdSenseAd';

interface BannerAdProps {
  className?: string;
}

const BannerAd = ({ className = '' }: BannerAdProps) => {
  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <AdSenseAd
        adSlot="1234567890" // Replace with your actual ad slot ID
        adFormat="auto"
        className="max-w-4xl w-full"
        style={{ minHeight: '90px' }}
      />
    </div>
  );
};

export default BannerAd;
