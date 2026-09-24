import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL, BRAND_NAME, DEFAULT_DESCRIPTION, DEFAULT_SHARE_IMAGE } from '../data/business';

// `title` gets " | Homev Construction" appended unless `fullTitle` is set.
// `path` overrides the canonical path, e.g. when a page is reachable at more
// than one URL. `noindex` keeps a page out of search results.
const SEO = ({ title, fullTitle, description, path, image, noindex = false }) => {
    const location = useLocation();
    const pageTitle = fullTitle || `${title} | ${BRAND_NAME}`;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path ?? location.pathname}`.replace(/\/$/, '') || SITE_URL;
    const shareImage = image || DEFAULT_SHARE_IMAGE;

    return (
        <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={desc} />
            {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
            <meta property="og:site_name" content={BRAND_NAME} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={shareImage} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={shareImage} />
        </Helmet>
    );
};

export default SEO;
