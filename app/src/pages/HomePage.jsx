import Hero from '../components/Hero';
import Services from '../components/Services';
import Operations from '../components/Operations';
import Projects from '../components/Projects';

const HomePage = () => {
    return (
        <>
            <Hero />
            <Services preview={true} />
            <Operations />
            <Projects preview={true} />
        </>
    );
};

export default HomePage;
