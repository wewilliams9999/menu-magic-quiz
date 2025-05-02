
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResultAlertsProps {
  noExactMatches: boolean;
  hasAlternatives: boolean;
  allAlternatives: boolean;
  hasDistanceInfo: boolean;
}

const ResultAlerts = ({ 
  noExactMatches, 
  hasAlternatives, 
  allAlternatives, 
  hasDistanceInfo 
}: ResultAlertsProps) => {
  if (!noExactMatches && !hasAlternatives) {
    return null;
  }
  
  return (
    <>
      {noExactMatches && (
        <Alert className="mb-6 bg-amber-950/20 border-amber-800/50">
          <AlertDescription className="text-amber-300 text-center">
            There are no exact matches for your criteria, but these are the closest to your preferences.
          </AlertDescription>
        </Alert>
      )}
      
      {hasAlternatives && !allAlternatives && hasDistanceInfo && (
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
