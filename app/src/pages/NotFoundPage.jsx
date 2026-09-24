import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';

const NotFoundPage = () => (
    <PageTransition>
        <SEO title="Page Not Found" noindex />
        <div className="page-container">
            <div className="container text-center" style={{ padding: '80px 0' }}>
                <h1 className="section-title">Page Not Found</h1>
                <p style={{ color: 'var(--text-dim)', margin: '0 auto 30px', maxWidth: '520px' }}>
                    The page you're looking for doesn't exist or has moved.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                    <Link to="/services" className="btn btn-outline">Our Services</Link>
                </div>
            </div>
        </div>
    </PageTransition>
);

export default NotFoundPage;
