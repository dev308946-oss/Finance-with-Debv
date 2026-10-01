import { SITE_CONFIG } from '../config/siteConfig';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Analytics dispatcher ready for Google Analytics (GA4), Meta Pixel,
 * Google Tag Manager, or custom event listeners.
 */
export function trackEvent(
  eventName: string,
  properties: Record<string, string | number | boolean> = {}
): void {
  if (!SITE_CONFIG.analytics.enabled || typeof window === 'undefined') {
    return;
  }

  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...properties,
  };

  // 1. Google Tag Manager / dataLayer support
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  // 2. Google Analytics 4 (gtag) support
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties);
  }

  // 3. Meta Pixel (Instagram bio traffic attribution) support
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, properties);
  }

  // 4. Custom browser event hook
  window.dispatchEvent(new CustomEvent('fwd:analytics', { detail: payload }));
}
