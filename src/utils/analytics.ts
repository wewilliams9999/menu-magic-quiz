
/**
 * Utility functions for tracking events with Google Analytics
 */

/**
 * Track a custom event in Google Analytics
 * 
 * @param eventName - The name of the event to track
 * @param eventParams - Additional parameters to send with the event
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  } else {
    console.log('Google Analytics not loaded - would track:', eventName, eventParams);
  }
};

/**
 * Track when a user starts the quiz
 */
export const trackQuizStart = () => {
  trackEvent('quiz_start');
};

/**
 * Track when a user completes the quiz
 */
export const trackQuizComplete = () => {
  trackEvent('quiz_complete');
};

/**
 * Track when a user views a restaurant
 * 
 * @param restaurantName - The name of the restaurant viewed
 */
export const trackRestaurantView = (restaurantName: string) => {
  trackEvent('restaurant_view', { restaurant_name: restaurantName });
};

/**
 * Track when a user clicks an external link
 * 
 * @param linkType - The type of link (website, instagram, reservation)
 * @param url - The URL being clicked
 * @param restaurantName - The name of the restaurant associated with the link
 */
export const trackLinkClick = (linkType: string, url: string, restaurantName: string) => {
  trackEvent('external_link_click', {
    link_type: linkType,
    url,
    restaurant_name: restaurantName
  });
};
