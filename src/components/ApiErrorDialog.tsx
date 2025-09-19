import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { getFilteredFallbackRestaurants } from "@/services/mockData";
import { RestaurantApiParams } from "@/services/restaurantService";
import { QuizResult } from "@/utils/quizData";

interface ApiErrorDialogProps {
  error: string;
  onUseMockData: (mockResults: QuizResult[]) => void;
  onRetry: () => void;
  apiParams: RestaurantApiParams;
}

const ApiErrorDialog = ({ error, onUseMockData, onRetry, apiParams }: ApiErrorDialogProps) => {
  const handleUseMockData = () => {
    const mockResults = getFilteredFallbackRestaurants({
      cuisine: apiParams.cuisine,
      price: apiParams.price,
      neighborhoods: apiParams.neighborhoods,
      userLocation: apiParams.userLocation,
      distance: apiParams.distance
    });
    onUseMockData(mockResults);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Alert className="border-red-500 bg-red-950/10 text-red-400">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">API Connection Failed</h3>
            <p className="text-sm">
              We're having trouble connecting to our restaurant database. This could be due to:
            </p>
            <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-red-300">
              <li>Network connectivity issues</li>
              <li>Google Places API service temporarily unavailable</li>
              <li>Rate limiting or quota exceeded</li>
            </ul>
            <p className="text-xs mt-2 text-red-300">Error: {error}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="border-red-500 text-red-400 hover:bg-red-950/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleUseMockData}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Use Sample Data Instead
            </Button>
          </div>
          
          <div className="text-xs text-red-300 bg-red-950/20 p-3 rounded border border-red-800">
            <strong>Note:</strong> Sample data contains curated Nashville restaurants but may not reflect real-time availability or current information. For the most accurate results, please try the API connection again.
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ApiErrorDialog;