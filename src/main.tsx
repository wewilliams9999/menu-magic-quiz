
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the root
const root = createRoot(document.getElementById("root")!);

// Declare gtag as a global function
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
  }
}

// Track page views when the URL changes
const trackPageView = () => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
};

// Listen for route changes to track page views
// This will run once on initial load
window.addEventListener('popstate', trackPageView);

// Initial tracking when the app loads
setTimeout(trackPageView, 100);

// Render the app
root.render(<App />);
