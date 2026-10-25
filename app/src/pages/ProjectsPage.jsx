import SEO from '../components/SEO';
import Projects from '../components/Projects';
import PageTransition from '../components/PageTransition';

const ProjectsPage = () => {
    return (
        <PageTransition>
            <SEO title="Renovation Projects & Portfolio" description="Before-and-after renovation and construction projects by Homev Construction across Toronto and the GTA." />
            <div className="page-container">
                <Projects />
            </div>
        </PageTransition>
    );
};

export default ProjectsPage;
