import React, { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { preventTelegramSwipeClose } from "../../shared/lib/preventTelegramSwipeClose";
import { router } from "../router";

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
    WebApp.setHeaderColor("#23222A");
    // Set background color
    WebApp.setBackgroundColor("#23222A");

    // Handle Telegram Mini App deep links via start_param
    // Supports formats:
    // - "event:<uuid>" or "event/<uuid>"
    // - raw <uuid>
    // - base64(base64url) JSON: { "route": "event", "id": "<uuid>" }
    // Also supports dev/testing via ?tgWebAppStartParam=...
    const getStartParam = (): string | undefined => {
      const fromInitData = WebApp?.initDataUnsafe?.start_param as
        | string
        | undefined;
      if (
        fromInitData &&
        typeof fromInitData === "string" &&
        fromInitData.length
      ) {
        return fromInitData;
      }
      const url = new URL(window.location.href);
      const qp = url.searchParams;
      const fromQuery =
        qp.get("tgWebAppStartParam") ||
        qp.get("start_param") ||
        qp.get("startParam") ||
        qp.get("startapp") ||
        qp.get("start");
      return fromQuery ?? undefined;
    };

    const isUuid = (value: string): boolean => {
      const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidV4Regex.test(value);
    };

    const tryBase64Json = (
      value: string
    ): { route?: string; id?: string; type?: string } | null => {
      try {
        // Normalize base64url → base64
        const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(
          Math.ceil(normalized.length / 4) * 4,
          "="
        );
        const decoded = atob(padded);
        const json = JSON.parse(decoded);
        return typeof json === "object" && json ? json : null;
      } catch {
        return null;
      }
    };

    const parseEventId = (raw: string): string | null => {
      if (!raw) return null;
      const trimmed = raw.trim();

      // Try JSON payload first
      const json = tryBase64Json(trimmed);
      if (
        json &&
        (json.route === "event" || json.type === "event") &&
        typeof json.id === "string"
      ) {
        return json.id;
      }

      // Support "event:<id>" and "event/<id>"
      const colonIdx = trimmed.indexOf(":");
      const slashIdx = trimmed.indexOf("/");
      if (
        colonIdx > 0 &&
        trimmed.slice(0, colonIdx).toLowerCase() === "event"
      ) {
        return trimmed.slice(colonIdx + 1);
      }
      if (
        slashIdx > 0 &&
        trimmed.slice(0, slashIdx).toLowerCase() === "event"
      ) {
        return trimmed.slice(slashIdx + 1);
      }

      // Support query-like "eventId=<id>" or "id=<id>"
      if (trimmed.includes("=")) {
        const params = new URLSearchParams(trimmed);
        const byKey = params.get("eventId") || params.get("id");
        if (byKey) return byKey;
      }

      // Fallback: assume raw is the UUID itself
      if (isUuid(trimmed)) {
        return trimmed;
      }

      return null;
    };

    const startParam = getStartParam();
    if (startParam) {
      const eventId = parseEventId(startParam);
      if (eventId && isUuid(eventId)) {
        const currentPath = window.location.pathname;
        const targetPath = `/event/${eventId}`;
        if (currentPath !== targetPath) {
          router.navigate(targetPath);
        }
      }
    }

    return () => {
      // Clean up event listeners
      cleanupPreventSwipeClose();
    };
  }, []);

  return <>{component()}</>;
};
