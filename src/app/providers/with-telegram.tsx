import React, { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { preventTelegramSwipeClose } from '../../shared/lib/preventTelegramSwipeClose';

export const withTelegram = (component: () => React.ReactNode) => () => {
  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();

    // Check if the device is mobile (iOS/Android) before requesting fullscreen
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      WebApp.expand();
    }

    // Prevent accidental closing on swipe
    // This is available in Telegram WebApp version 7.7+
    if (WebApp.disableVerticalSwipes) {
      WebApp.disableVerticalSwipes();
    }

    // Add closing confirmation to prevent accidental app closures
    WebApp.enableClosingConfirmation();

    // Apply additional prevention for swipe close (works on older versions too)
    const cleanupPreventSwipeClose = preventTelegramSwipeClose();

    // Set header color
    WebApp.setHeaderColor('#23222A');
    // Set background color
    WebApp.setBackgroundColor('#23222A');

    return () => {
      // Clean up event listeners
      cleanupPreventSwipeClose();
    };
  }, []);

  return <>{component()}</>;
};
