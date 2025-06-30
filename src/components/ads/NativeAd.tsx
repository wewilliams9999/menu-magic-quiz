
import AdSenseAd from './AdSenseAd';

interface NativeAdProps {
  className?: string;
}

const NativeAd = ({ className = '' }: NativeAdProps) => {
  return (
    <div className={`w-full my-6 ${className}`}>
      <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
      <AdSenseAd
        adSlot="0987654321" // Replace with your actual ad slot ID
        adFormat="auto"
        className="rounded-lg border border-gray-200 dark:border-gray-700"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
};

export default NativeAd;
