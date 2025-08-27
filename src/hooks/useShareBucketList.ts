import { useCallback } from 'react';
import { QuizResult } from '@/utils/quiz/types';
import { useToast } from '@/hooks/use-toast';

interface UseShareBucketListProps {
  restaurants: QuizResult[];
}

export const useShareBucketList = ({ restaurants }: UseShareBucketListProps) => {
  const { toast } = useToast();

  const generateShareImage = useCallback(async (element: HTMLElement): Promise<Blob | null> => {
    try {
      // Import html2canvas dynamically to reduce bundle size
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution for better quality
        useCORS: true,
        allowTaint: true,
        width: 384, // Fixed width for consistency
        height: 600, // Approximate height
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 0.95);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  }, []);

  const shareResults = useCallback(async (cardElement: HTMLElement | null) => {
    if (!cardElement) {
      toast({
        title: "Error",
        description: "Unable to generate share image. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const topThreeNames = restaurants.slice(0, 3).map(r => r.name).join(', ');
    const shareText = `My Nashville Restaurant Bucket List: ${topThreeNames}. What are yours? 🍽️ See if we match up!`;
    const shareUrl = window.location.origin;

    try {
      // Check if Web Share API is supported and we can share images
      if (navigator.share && navigator.canShare) {
        const imageBlob = await generateShareImage(cardElement);
        
        if (imageBlob) {
          const file = new File([imageBlob], 'my-nashville-bucket-list.png', { type: 'image/png' });
          
          // Check if we can share files
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'My Nashville Restaurant Bucket List',
              text: shareText,
              url: shareUrl,
              files: [file],
            });
            return;
          }
        }
        
        // Fallback to sharing without image
        await navigator.share({
          title: 'My Nashville Restaurant Bucket List',
          text: shareText,
          url: shareUrl,
        });
        return;
      }
    } catch (error) {
      console.error('Native sharing failed:', error);
    }

    // Fallback: Copy to clipboard
    try {
      const textToCopy = `${shareText}\n\n${shareUrl}`;
      await navigator.clipboard.writeText(textToCopy);
      
      toast({
        title: "Copied to clipboard! 📋",
        description: "Share text copied. You can now paste it anywhere!",
      });
    } catch (error) {
      console.error('Clipboard failed:', error);
      toast({
        title: "Share your results",
        description: `${shareText}\n\n${shareUrl}`,
      });
    }
  }, [restaurants, toast, generateShareImage]);

  return { shareResults };
};