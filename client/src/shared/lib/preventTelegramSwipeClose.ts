/**
 * This utility helps prevent Telegram Mini App from closing when users swipe
 * within the application. It ensures that the window never has a scrollY of 0,
 * which would trigger the Telegram app's swipe-to-close behavior.
 */

export function preventTelegramSwipeClose() {
  // Ensure the document is scrollable by adding a small amount to scroll
  const ensureScrollable = () => {
    if (window.scrollY === 0) {
      window.scrollTo(0, 1);
    }
  };

  // Add event listeners
  document.addEventListener('touchstart', ensureScrollable);
  document.addEventListener('scroll', ensureScrollable);

  // Initial call to ensure scrollability
  ensureScrollable();

  // Return cleanup function
  return () => {
    document.removeEventListener('touchstart', ensureScrollable);
    document.removeEventListener('scroll', ensureScrollable);
  };
}
