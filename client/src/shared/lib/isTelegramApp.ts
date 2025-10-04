/**
 * Checks if the current browser is the Telegram WebApp
 * @returns {boolean} True if the current browser is the Telegram WebApp
 */
export const isTelegramApp = (): boolean => {
  // Check if Telegram WebApp object exists
  const hasTelegramWebApp =
    typeof (window as any).Telegram !== 'undefined' &&
    typeof (window as any).Telegram.WebApp !== 'undefined';

  // Check if user agent contains Telegram
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;
  const hasTelegramInUserAgent = /telegram/i.test(userAgent.toLowerCase());

  return hasTelegramWebApp || hasTelegramInUserAgent;
};
