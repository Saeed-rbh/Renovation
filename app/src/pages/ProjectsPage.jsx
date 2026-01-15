import Projects from '../components/Projects';
import PageTransition from '../components/PageTransition';

const ProjectsPage = () => {
    return (
        <PageTransition>
            <div className="page-container">
                <Projects />
            </div>
        </PageTransition>
    );
};

export default ProjectsPage;
