
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton = ({ onReset }: ResetButtonProps) => {
  return (
    <div className="mt-12 text-center">
      <Button 
        onClick={onReset} 
        variant="outline" 
        className="gap-2 border-zinc-700 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" /> Start Over
      </Button>
    </div>
  );
};

export default ResetButton;
