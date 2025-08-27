import React, { useState, useRef } from 'react';
import { Share2, Download, Copy, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { QuizResult } from '@/utils/quiz/types';
import ShareBucketList from './ShareBucketList';
import { useShareBucketList } from '@/hooks/useShareBucketList';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/utils/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: QuizResult[];
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, restaurants }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { shareResults } = useShareBucketList({ restaurants });
  const { toast } = useToast();

  const topThreeNames = restaurants.slice(0, 3).map(r => r.name).join(', ');
  const shareText = `My Nashville Restaurant Picks: ${topThreeNames}. What are yours? 🍽️ See if we match up!`;
  const shareUrl = window.location.origin;

  const handleNativeShare = async () => {
    setIsSharing(true);
    try {
      const cardElement = cardRef.current?.querySelector('[data-share-card]') as HTMLElement;
      await shareResults(cardElement);
      trackEvent('share_bucket_list', { method: 'native' });
      onClose();
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const cardElement = cardRef.current?.querySelector('[data-share-card]') as HTMLElement;
      if (!cardElement) return;

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 384,
        height: 600,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'my-nashville-picks.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Image saved! 📸",
            description: "Your Nashville picks image has been downloaded.",
          });
          trackEvent('share_bucket_list', { method: 'download_image' });
          onClose();
        }
      }, 'image/png', 0.95);
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "Unable to download image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = async () => {
    try {
      const textToCopy = `${shareText}\n\n${shareUrl}`;
      await navigator.clipboard.writeText(textToCopy);
      
      toast({
        title: "Copied! 📋",
        description: "Share text copied to clipboard.",
      });
      trackEvent('share_bucket_list', { method: 'copy_text' });
      onClose();
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try manual selection.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-4">
            Share Your Nashville Picks
          </DialogTitle>
        </DialogHeader>

        {/* Preview Card */}
        <div className="flex justify-center mb-6">
          <div ref={cardRef} className="transform scale-75 origin-center">
            <ShareBucketList 
              restaurants={restaurants} 
              className="shadow-lg"
              data-share-card
            />
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <Button
            onClick={handleNativeShare}
            disabled={isSharing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            {isSharing ? 'Sharing...' : 'Share'}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              variant="outline"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              {isDownloading ? 'Saving...' : 'Save Image'}
            </Button>

            <Button
              onClick={handleCopyText}
              variant="outline"
              size="lg"
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy Text
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Choose how you'd like to share your Nashville restaurant picks!
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;