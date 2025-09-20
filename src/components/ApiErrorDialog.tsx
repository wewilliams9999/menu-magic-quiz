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

  // Determine the type of error and customize the message
  const getErrorDetails = () => {
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes('access denied') || lowerError.includes('request_denied')) {
      return {
        title: 'API Configuration Issue',
        description: 'The Google Places API access is currently restricted. This usually means the API key needs to be updated with proper permissions.',
        causes: [
          'API key restrictions are too strict for server-side use',
          'Google Cloud project settings need adjustment',
          'API key might be configured for web-only use'
        ],
        suggestion: 'This is a configuration issue that needs to be resolved by the app administrator.'
      };
    }
    
    if (lowerError.includes('quota exceeded') || lowerError.includes('over_query_limit')) {
      return {
        title: 'API Quota Exceeded',
        description: 'The daily limit for Google Places API calls has been reached.',
        causes: [
          'Daily quota limit reached',
          'Too many requests in a short time',
          'Billing account may need attention'
        ],
        suggestion: 'Please try again later, or use sample data for now.'
      };
    }
    
    if (lowerError.includes('no restaurants found')) {
      return {
        title: 'No Restaurants Found',
        description: 'Your search criteria didn\'t match any restaurants in the area.',
        causes: [
          'Search criteria too specific',
          'Selected area has limited options',
          'Price or cuisine filters too restrictive'
        ],
        suggestion: 'Try adjusting your preferences or expanding your search area.'
      };
    }
    
    // Default error details
    return {
      title: 'API Connection Failed',
      description: 'We\'re having trouble connecting to our restaurant database.',
      causes: [
        'Network connectivity issues',
        'Google Places API service temporarily unavailable',
        'Server configuration problem'
      ],
      suggestion: 'Please try again in a few moments.'
    };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Alert className="border-red-500 bg-red-950/10 text-red-400">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{errorDetails.title}</h3>
            <p className="text-sm mb-3">
              {errorDetails.description}
            </p>
            {errorDetails.causes.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Possible causes:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-red-300">
                  {errorDetails.causes.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm mt-3 text-red-300">{errorDetails.suggestion}</p>
            <p className="text-xs mt-2 text-red-400 font-mono bg-red-950/30 p-2 rounded">
              Technical details: {error}
            </p>
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