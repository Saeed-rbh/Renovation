import SEO from '../components/SEO';
import Services from '../components/Services';
import PageTransition from '../components/PageTransition';

const ServicesPage = () => {
    return (
        <PageTransition>
            <SEO title="Renovation Services in Burlington & the GTA" description="Kitchen, bathroom and basement renovations, flooring, painting, stairs, structural work and full home remodels from Homev Construction in Burlington, serving Halton and the GTA." />
            <div className="page-container">
                <Services />
            </div>
        </PageTransition>
    );
};

export default ServicesPage;
