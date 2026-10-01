import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID, isPrerender } from '../data/business';

// Only the live site reports, so local testing and the build-time
// prerenderer never show up as visits or leads.
const enabled = typeof window !== 'undefined'
    && !isPrerender
    && /(^|\.)homevconstruction\.ca$/.test(window.location.hostname);

let started = false;

export const initAnalytics = () => {
    if (!enabled || started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Page views are sent by trackPageView on every route change instead.
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
    if (GOOGLE_ADS_ID) window.gtag('config', GOOGLE_ADS_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
};

export const trackEvent = (name, params = {}) => {
    if (!enabled || !window.gtag) return;
    window.gtag('event', name, params);
};

export const trackPageView = (path) => trackEvent('page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title
});

// Leads are what Google Ads optimizes for: mark `generate_lead` and
// `click_to_call` as key events in GA4, then import them into Ads.
export const trackLead = (source, params = {}) => trackEvent('generate_lead', { lead_source: source, ...params });
