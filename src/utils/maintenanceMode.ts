// Toggle this to enable/disable maintenance mode
export const MAINTENANCE_MODE = true;

// Check if user has test access via URL parameter
export const isTestMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('test') === 'true';
};

// Check if maintenance mode is active for current user
export const isMaintenanceActive = (): boolean => {
  return MAINTENANCE_MODE && !isTestMode();
};
