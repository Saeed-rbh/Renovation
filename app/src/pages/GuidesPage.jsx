import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { publishedGuides, formatGuideDate } from '../data/guides';
import { SITE_URL } from '../data/business';
import './Guides.css';

const GuidesPage = () => {
    const list = publishedGuides();
    const [featured, ...rest] = list;

    return (
        <PageTransition>
            <SEO
                title="Renovation Guides & Tips"
                description="Plain-language renovation guides from Homev Construction: legal basements, egress windows, waterproofing, kitchens, bathrooms and more for Toronto and GTA homeowners."
                image={featured ? `${SITE_URL}${featured.image}` : undefined}
            />
            <div className="page-container">
                <div className="container guides-page">
                    <Breadcrumbs items={[{ label: 'Guides' }]} />
                    <header className="guides-intro">
                        <h1 className="section-title">Renovation Guides</h1>
                        <p>Straight answers to the questions homeowners ask us most, from legal basements to waterproofing. A new guide every week.</p>
                    </header>

                    {featured && (
                        <Link to={`/guides/${featured.slug}`} className="guide-featured">
                            <img src={featured.image} alt={featured.imageAlt} loading="eager" />
                            <div className="guide-featured-body">
                                <span className="guide-category">{featured.category}</span>
                                <h2>{featured.title}</h2>
                                <p>{featured.description}</p>
                                <span className="guide-meta">
                                    {formatGuideDate(featured.published)} · <Clock size={14} aria-hidden="true" /> {featured.readMinutes} min read
                                </span>
                            </div>
                        </Link>
                    )}

                    {rest.length > 0 && (
                        <div className="guide-grid">
                            {rest.map(g => (
                                <Link key={g.slug} to={`/guides/${g.slug}`} className="guide-card">
                                    <img src={g.image} alt={g.imageAlt} loading="lazy" />
                                    <div className="guide-card-body">
                                        <span className="guide-category">{g.category}</span>
                                        <h3>{g.title}</h3>
                                        <span className="guide-meta">
                                            {formatGuideDate(g.published)} · {g.readMinutes} min read
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default GuidesPage;
