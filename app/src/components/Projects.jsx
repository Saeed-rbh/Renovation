import './Projects.css';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { projects } from '../data/projects';

const Projects = ({ preview = false }) => {
    return (
        <section className="section projects" id="projects">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Our Projects</h2>
                    <div className="section-divider"></div>
                </div>

                <div className="projects-grid">
                    {projects.map((project) => (
                        <Link to={`/projects/${project.id}`} key={project.id} className="project-card-link">
                            <div className="project-card">
                                <img src={project.mainImage} alt={project.title} className="project-image" />
                                <div className="project-info">
                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-category">{project.category}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {preview && (
                    <div className="text-center" style={{ marginTop: '40px' }}>
                        <Link to="/projects" className="btn btn-primary">
                            View All Projects <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
