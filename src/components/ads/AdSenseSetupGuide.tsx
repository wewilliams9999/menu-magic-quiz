
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, CheckCircle } from "lucide-react";

const AdSenseSetupGuide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google AdSense Setup Guide</CardTitle>
          <CardDescription>
            Follow these steps to complete your AdSense integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              AdSense code structure has been implemented on your site!
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Step 1: Apply for AdSense</h3>
              <p className="text-sm text-gray-600 mt-1">
                Visit <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                  Google AdSense <ExternalLink className="h-3 w-3 ml-1" />
                </a> and apply with your nashmenus.com domain
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Step 2: Get Your Publisher ID</h3>
              <p className="text-sm text-gray-600 mt-1">
                Once approved, replace "ca-pub-XXXXXXXXXX" in the code with your actual publisher ID
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Step 3: Create Ad Units</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create ad units in AdSense and replace the placeholder ad slot IDs in BannerAd.tsx and NativeAd.tsx
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Step 4: Update Privacy Policy</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add AdSense-required privacy policy updates about cookies and data collection
              </p>
            </div>
          </div>
          
          <Alert>
            <AlertDescription>
              <strong>Current Ad Placements:</strong><br />
              • Banner ad at top of results page<br />
              • Native ads between every 3rd restaurant card<br />
              • All ads are responsive and mobile-friendly
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSenseSetupGuide;
