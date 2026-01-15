import SEO from '../components/SEO';
import Projects from '../components/Projects';
import PageTransition from '../components/PageTransition';

const ProjectsPage = () => {
    return (
        <PageTransition>
            <SEO title="Our Projects" description="Explore our portfolio of renovation and construction projects across Toronto." />
            <div className="page-container">
                <Projects />
            </div>
        </PageTransition>
    );
};

export default ProjectsPage;
