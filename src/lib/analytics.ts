/**
 * Client-side analytics event tracking.
 * Sends events to a simple endpoint for later aggregation.
 * Falls back silently if tracking fails — never blocks the UI.
 *
 * Events are stored as structured logs viewable in Vercel.
 * Can be extended to send to Mixpanel, PostHog, etc.
 */

type AnalyticsEvent =
  | "page_view"
  | "listing_viewed"
  | "checkout_started"
  | "checkout_completed"
  | "provider_application_started"
  | "listing_created"
  | "booking_completed"
  | "search_performed";

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  if (typeof window === "undefined") return;

  try {
    const payload = {
      event,
      properties: {
        ...properties,
        url: window.location.pathname,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString(),
      },
    };

    // Use sendBeacon for fire-and-forget (survives page unloads)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    }
  } catch {
    // Never block UI for analytics
  }
}
