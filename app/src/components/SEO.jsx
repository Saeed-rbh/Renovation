import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
    return (
        <Helmet>
            <title>{title} | HomeV Renovation</title>
            <meta name="description" content={description || "HomeV Renovation - Professional Renovation and Construction Services in Toronto."} />
            <meta property="og:title" content={`${title} | HomeV Renovation`} />
            <meta property="og:description" content={description || "HomeV Renovation - Professional Renovation and Construction Services in Toronto."} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
    );
};

export default SEO;
