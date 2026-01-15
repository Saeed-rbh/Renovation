import SEO from '../components/SEO';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Operations from '../components/Operations';
import Projects from '../components/Projects';
import PageTransition from '../components/PageTransition';

const HomePage = () => {
    return (
        <PageTransition>
            <SEO title="Home" description="HomeV Renovation - Transforming homes with quality craftsmanship and design." />
            <Hero />
            <Services preview={true} />
            <Operations />
            <Projects preview={true} />
        </PageTransition>
    );
};

export default HomePage;
