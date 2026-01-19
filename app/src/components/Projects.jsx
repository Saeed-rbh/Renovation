import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Projects.css';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import SkeletonLoader from './SkeletonLoader';
import SpotlightCard from './SpotlightCard';

import { slugify } from '../utils/helpers';

const Projects = ({ preview = false }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const displayProjects = preview ? projects.slice(0, 3) : projects;

    return (
        <section className={`section projects ${preview ? 'home-preview' : ''}`} id="projects">
            <div className="container">
                <motion.div
                    className="section-header text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="section-title">Our Projects</h2>
                    <div className="section-divider"></div>
                </motion.div>

                <div className="projects-grid">
                    {loading ? (
                        <SkeletonLoader type="card" count={preview ? 3 : 6} />
                    ) : (
                        displayProjects.map((project, index) => (
                            <Link to={`/projects/${slugify(project.title)}`} key={project.id} className="project-card-link">
                                <motion.div
                                    className="project-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                                >
                                    <SpotlightCard className="h-full">
                                        <img src={project.mainImage} alt={project.title} className="project-image" loading="lazy" decoding="async" />
                                        <div className="project-info">
                                            <h3 className="project-title">{project.title}</h3>
                                            <p className="project-category">{project.category}</p>
                                        </div>
                                    </SpotlightCard>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>
                {preview && (
                    <motion.div
                        className="text-center"
                        style={{ marginTop: '40px' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link to="/projects" className="btn btn-primary">
                            View All Projects <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Projects;
