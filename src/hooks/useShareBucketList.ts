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
        description: "Unable to generate share content. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const topThreeNames = restaurants.slice(0, 3).map(r => r.name).join(', ');
    const shareText = `My Nashville Restaurant Picks: ${topThreeNames}. What are yours? 🍽️ See if we match up!`;
    const shareUrl = window.location.origin;

    // Create a comprehensive fallback that works in iframe environments
    const createFallbackShare = () => {
      const fullShareText = `${shareText}\n\nDiscover your perfect Nashville restaurants: ${shareUrl}`;
      
      // Try to create a downloadable text file
      try {
        const blob = new Blob([fullShareText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-nashville-restaurant-picks.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Share file downloaded! 📄",
          description: "Your restaurant picks have been saved as a text file. Share it anywhere!",
        });
        return;
      } catch (error) {
        console.error('File download failed:', error);
      }

      // Final fallback: Show the text in a toast for manual copying
      toast({
        title: "Ready to share! 📋",
        description: fullShareText,
        duration: 10000, // Show longer so they can copy it
      });
    };

    // Try native sharing first (won't work in Lovable iframe but will work when deployed)
    try {
      if (navigator.share && !window.location.hostname.includes('lovable.dev')) {
        const imageBlob = await generateShareImage(cardElement);
        
        if (imageBlob) {
          const file = new File([imageBlob], 'my-nashville-picks.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'My Nashville Restaurant Picks',
              text: shareText,
              url: shareUrl,
              files: [file],
            });
            return;
          }
        }
        
        await navigator.share({
          title: 'My Nashville Restaurant Picks',
          text: shareText,
          url: shareUrl,
        });
        return;
      }
    } catch (error) {
      console.error('Native sharing failed:', error);
    }

    // Try clipboard (won't work in Lovable iframe but will work when deployed)
    try {
      if (!window.location.hostname.includes('lovable.dev')) {
        const textToCopy = `${shareText}\n\n${shareUrl}`;
        await navigator.clipboard.writeText(textToCopy);
        
        toast({
          title: "Copied to clipboard! 📋",
          description: "Share text copied. You can now paste it anywhere!",
        });
        return;
      }
    } catch (error) {
      console.error('Clipboard failed:', error);
    }

    // Use fallback for iframe environments (like Lovable preview)
    createFallbackShare();
  }, [restaurants, toast, generateShareImage]);

  return { shareResults };
};