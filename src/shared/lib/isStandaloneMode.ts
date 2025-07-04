/**
 * Checks if the app is running in standalone mode (installed on home screen)
 * @returns {boolean} True if the app is running in standalone mode
 */
export const isStandaloneMode = (): boolean => {
  // For iOS
  const iosStandalone = window.navigator.standalone === true;

  // For Android and other browsers
  const displayModeStandalone = window.matchMedia(
    '(display-mode: standalone)',
  ).matches;

  return iosStandalone || displayModeStandalone;
};
