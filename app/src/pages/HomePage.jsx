import Hero from '../components/Hero';
import Services from '../components/Services';
import Operations from '../components/Operations';
import Projects from '../components/Projects';
import PageTransition from '../components/PageTransition';

const HomePage = () => {
    return (
        <PageTransition>
            <Hero />
            <Services preview={true} />
            <Operations />
            <Projects preview={true} />
        </PageTransition>
    );
};

export default HomePage;
