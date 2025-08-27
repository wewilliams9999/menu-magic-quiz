import React, { useState, useRef } from 'react';
import { Share2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { QuizResult } from '@/utils/quiz/types';
import ShareBucketList from './ShareBucketList';
import { useShareBucketList } from '@/hooks/useShareBucketList';

interface ShareBucketListButtonProps {
  restaurants: QuizResult[];
  className?: string;
}

const ShareBucketListButton: React.FC<ShareBucketListButtonProps> = ({ 
  restaurants, 
  className = '' 
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const hiddenCardRef = useRef<HTMLDivElement>(null);
  const { shareResults } = useShareBucketList({ restaurants });

  const handleShare = async () => {
    if (restaurants.length === 0) return;
    
    setIsSharing(true);
    
    try {
      // Find the hidden card element to use for image generation
      const cardElement = hiddenCardRef.current?.querySelector('[data-share-card]') as HTMLElement;
      await shareResults(cardElement);
    } finally {
      setIsSharing(false);
    }
  };

  if (restaurants.length === 0) return null;

  return (
    <>
      <Button
        onClick={handleShare}
        disabled={isSharing}
        className={`inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}
        size="lg"
      >
        {isSharing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Share2 className="w-5 h-5" />
        )}
        {isSharing ? 'Creating Image...' : 'Share My Bucket List'}
      </Button>

      {/* Hidden card for image generation */}
      <div 
        ref={hiddenCardRef}
        className="fixed -top-[9999px] -left-[9999px] pointer-events-none"
        style={{ zIndex: -1 }}
      >
        <ShareBucketList 
          restaurants={restaurants} 
          className="shadow-none"
          data-share-card
        />
      </div>
    </>
  );
};

export default ShareBucketListButton;