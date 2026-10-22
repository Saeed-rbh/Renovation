import { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Clock, Phone } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { getGuide, publishedGuides, formatGuideDate } from '../data/guides';
import { SITE_URL, BRAND_NAME, PHONE_DISPLAY, PHONE_TEL } from '../data/business';
import './Guides.css';

const headingId = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const Credit = ({ credit }) => {
    if (!credit) return null;
    // credit: { author, source, sourceUrl, license, licenseUrl }
    return (
        <span className="guide-credit">
            Photo: {credit.sourceUrl ? <a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.author || credit.source}</a> : (credit.author || credit.source)}
            {credit.license && <> · {credit.licenseUrl ? <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a> : credit.license}</>}
        </span>
    );
};

const Block = ({ block }) => {
    switch (block.type) {
        case 'h2':
            return <h2 id={headingId(block.text)}>{block.text}</h2>;
        case 'list':
            return <ul>{block.items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
        case 'steps':
            return (
                <ol className="guide-steps">
                    {block.items.map((s, i) => (
                        <li key={i}><strong>{s.title}.</strong> {s.text}</li>
                    ))}
                </ol>
            );
        case 'figure':
            return (
                <figure className="guide-figure">
                    <img src={block.src} alt={block.alt} loading="lazy" />
                    {(block.caption || block.credit) && (
                        <figcaption>{block.caption} <Credit credit={block.credit} /></figcaption>
                    )}
                </figure>
            );
        case 'callout':
            return (
                <aside className="guide-callout">
                    <strong>{block.title}</strong>
                    <p>{block.text}</p>
                </aside>
            );
        default:
            return <p>{block.text}</p>;
    }
};

const GuideArticlePage = () => {
    const { slug } = useParams();
    const guide = getGuide(slug);
    const visible = publishedGuides();

    useEffect(() => { window.scrollTo(0, 0); }, [slug]);

    if (!guide || !visible.some(g => g.slug === slug)) return <Navigate to="/guides" replace />;

    const toc = guide.body.filter(b => b.type === 'h2');
    const related = visible.filter(g => g.slug !== guide.slug).slice(0, 2);
    const url = `${SITE_URL}/guides/${guide.slug}`;
    const structured = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.description,
            image: `${SITE_URL}${guide.image}`,
            datePublished: guide.published,
            dateModified: guide.updated || guide.published,
            author: { '@type': 'Organization', name: BRAND_NAME, url: SITE_URL },
            publisher: { '@type': 'Organization', name: BRAND_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/homev-logo.png` } },
            mainEntityOfPage: url,
        },
        guide.faq?.length && {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: guide.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
    ].filter(Boolean);

    return (
        <PageTransition>
            <SEO title={guide.title} description={guide.description} image={`${SITE_URL}${guide.image}`} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
            <div className="page-container">
                <article className="container guide-article">
                    <Breadcrumbs items={[{ label: 'Guides', path: '/guides' }, { label: guide.category }]} />
                    <header className="guide-header">
                        <span className="guide-category">{guide.category}</span>
                        <h1>{guide.title}</h1>
                        <p className="guide-lede">{guide.description}</p>
                        <span className="guide-meta">
                            By {BRAND_NAME} · {formatGuideDate(guide.published)} · <Clock size={14} aria-hidden="true" /> {guide.readMinutes} min read
                        </span>
                    </header>

                    <figure className="guide-hero">
                        <img src={guide.image} alt={guide.imageAlt} />
                        {guide.imageCredit && <figcaption><Credit credit={guide.imageCredit} /></figcaption>}
                    </figure>

                    {toc.length > 2 && (
                        <nav className="guide-toc" aria-label="In this guide">
                            <strong>In this guide</strong>
                            <ol>{toc.map(h => <li key={h.text}><a href={`#${headingId(h.text)}`}>{h.text}</a></li>)}</ol>
                        </nav>
                    )}

                    <div className="guide-body">
                        {guide.body.map((b, i) => <Block key={i} block={b} />)}
                    </div>

                    {guide.faq?.length > 0 && (
                        <section className="guide-faq" aria-labelledby="faq-heading">
                            <h2 id="faq-heading">Frequently asked questions</h2>
                            {guide.faq.map(f => (
                                <details key={f.q}>
                                    <summary>{f.q}</summary>
                                    <p>{f.a}</p>
                                </details>
                            ))}
                        </section>
                    )}

                    <section className="guide-cta">
                        <h2>Planning a project like this?</h2>
                        <p>Talk to our team for a free, no-pressure estimate anywhere in Toronto and the GTA.</p>
                        <div className="guide-cta-actions">
                            <Link to="/estimator" className="btn btn-primary">Get a free estimate</Link>
                            <a href={`tel:${PHONE_TEL}`} className="guide-cta-phone"><Phone size={16} aria-hidden="true" /> {PHONE_DISPLAY}</a>
                        </div>
                        {guide.relatedService && (
                            <p className="guide-cta-service">See our <Link to={guide.relatedService.path}>{guide.relatedService.label}</Link> service.</p>
                        )}
                    </section>

                    <p className="guide-disclaimer">This guide is general information, not professional or legal advice. Building code and city rules change and vary by property, so confirm requirements with your municipality before starting work.</p>

                    {related.length > 0 && (
                        <section className="guide-related">
                            <h2>More guides</h2>
                            <div className="guide-grid">
                                {related.map(g => (
                                    <Link key={g.slug} to={`/guides/${g.slug}`} className="guide-card">
                                        <img src={g.image} alt={g.imageAlt} loading="lazy" />
                                        <div className="guide-card-body">
                                            <span className="guide-category">{g.category}</span>
                                            <h3>{g.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </div>
        </PageTransition>
    );
};

export default GuideArticlePage;
