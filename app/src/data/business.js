// Single source of truth for the business's public details. Search engines
// match name/address/phone across the site and directories, so keep these
// identical everywhere (and in the JSON-LD block in index.html).
export const SITE_URL = 'https://homevconstruction.ca';
export const BRAND_NAME = 'Homev Construction';
export const PHONE_DISPLAY = '+1 (437) 799-5005';
export const PHONE_TEL = '+14377995005';
export const EMAIL = 'info@homevconstruction.ca';
export const ADDRESS = '602 Appleby Line, Burlington, ON L7L 2Y3';
export const DEFAULT_DESCRIPTION = 'Homev Construction is a Burlington renovation and construction company serving Halton and the GTA: kitchens, bathrooms, basements, flooring, structural work and full home renovations.';
export const DEFAULT_SHARE_IMAGE = `${SITE_URL}/og-image.jpg`;

// Set by the build-time prerenderer so its page visits don't count as views.
export const isPrerender = typeof window !== 'undefined' && window.__PRERENDER__ === true;
