import { useState, useEffect } from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Projects = ({ preview = false }) => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // If preview is true, we might want to limit, but for now just slice in render if needed or limit query
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const displayProjects = preview ? projects.slice(0, 3) : projects;

    return (
        <section className="section projects" id="projects">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Our Projects</h2>
                    <div className="section-divider"></div>
                </div>

                <div className="projects-grid">
                    {displayProjects.map((project) => (
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
