import SEO from '../components/SEO';
import Services from '../components/Services';
import PageTransition from '../components/PageTransition';

const ServicesPage = () => {
    return (
        <PageTransition>
            <SEO title="Our Services" description="Comprehensive renovation services including kitchen, bathroom, basement, and full home remodeling." />
            <div className="page-container">
                <Services />
            </div>
        </PageTransition>
    );
};

export default ServicesPage;
