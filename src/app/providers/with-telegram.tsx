import React, { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export const withTelegram = (component: () => React.ReactNode) => () => {
  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();

    // Check if the device is mobile (iOS/Android) before requesting fullscreen
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      WebApp.expand();
    }

    // Set up the main button if needed
    // WebApp.MainButton.setText('CONTINUE');
    // WebApp.MainButton.show();

    // Set header color
    WebApp.setHeaderColor('#23222A');
    // Set background color
    WebApp.setBackgroundColor('#23222A');

    return () => {
      // Clean up if needed
    };
  }, []);

  return <>{component()}</>;
};
