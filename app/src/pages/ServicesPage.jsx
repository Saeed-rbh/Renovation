import Services from '../components/Services';
import PageTransition from '../components/PageTransition';

const ServicesPage = () => {
    return (
        <PageTransition>
            <div className="page-container">
                <Services />
            </div>
        </PageTransition>
    );
};

export default ServicesPage;
