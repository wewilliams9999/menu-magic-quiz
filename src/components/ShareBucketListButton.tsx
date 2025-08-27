import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { QuizResult } from '@/utils/quiz/types';
import ShareModal from './ShareModal';

interface ShareBucketListButtonProps {
  restaurants: QuizResult[];
  className?: string;
}

const ShareBucketListButton: React.FC<ShareBucketListButtonProps> = ({ 
  restaurants, 
  className = '' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = () => {
    if (restaurants.length === 0) return;
    setIsModalOpen(true);
  };

  if (restaurants.length === 0) return null;

  return (
    <>
      <Button
        onClick={handleShare}
        className={`inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}
        size="lg"
      >
        <Share2 className="w-5 h-5" />
        Share My Nashville Picks
      </Button>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        restaurants={restaurants}
      />
    </>
  );
};

export default ShareBucketListButton;