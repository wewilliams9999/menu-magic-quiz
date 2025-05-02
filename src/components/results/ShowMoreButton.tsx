
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ShowMoreButtonProps {
  onShowMore: () => void;
}

const ShowMoreButton = ({ onShowMore }: ShowMoreButtonProps) => {
  return (
    <div className="mt-8 text-center">
      <Button 
        onClick={onShowMore} 
        variant="outline" 
        className="gap-2 border-red-500/30 text-red-400 hover:bg-red-950/30 hover:text-red-300"
      >
        Show More Results
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShowMoreButton;
