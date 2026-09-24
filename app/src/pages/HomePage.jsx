import SEO from '../components/SEO';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Operations from '../components/Operations';
import Projects from '../components/Projects';
import PageTransition from '../components/PageTransition';

const HomePage = () => {
    return (
        <PageTransition>
            <SEO fullTitle="Homev Construction | Renovation & Construction Contractor in Burlington & the GTA" />
            <Hero />
            <Services preview={true} />
            <Operations />
            <Projects preview={true} />
        </PageTransition>
    );
};

export default HomePage;
