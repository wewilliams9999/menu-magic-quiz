
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ResultAlertsProps {
  noExactMatches: boolean;
  hasAlternatives: boolean;
  allAlternatives: boolean;
  hasDistanceInfo: boolean;
  onRetry?: () => void;
  results: any[]; // Add results prop to check actual distances
  requestedDistance?: number; // Add requested distance prop
}

const ResultAlerts = ({ 
  noExactMatches, 
  hasAlternatives, 
  allAlternatives, 
  hasDistanceInfo,
  onRetry,
  results,
  requestedDistance
}: ResultAlertsProps) => {
  // Check if there are actually restaurants outside the requested distance
  const hasRestaurantsOutsideDistance = results.some(result => 
    result.distanceFromUser && 
    requestedDistance && 
    result.distanceFromUser > requestedDistance
  );

  if (!noExactMatches && !hasAlternatives) {
    return null;
  }
  
  return (
    <>
      {allAlternatives && (
        <Alert className="mb-6 bg-amber-950/20 border-amber-800/50">
          <AlertDescription className="text-amber-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">No exact matches found for your preferences</p>
                <p className="text-sm text-amber-200">
                  Here are some popular Nashville restaurants that might interest you instead.
                </p>
              </div>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="ml-4 border-amber-600 text-amber-300 hover:bg-amber-950/50"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Try Again
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {hasAlternatives && !allAlternatives && hasDistanceInfo && hasRestaurantsOutsideDistance && (
        <Alert className="mb-6 bg-blue-950/20 border-blue-800/50">
          <AlertDescription className="text-blue-300 text-center">
            Some restaurants are outside your specified distance but may match your other preferences.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ResultAlerts;
