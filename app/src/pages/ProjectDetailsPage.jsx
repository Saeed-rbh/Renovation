import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { MapPin, ArrowLeft } from 'lucide-react';
import './ProjectDetailsPage.css';
import Loading from '../components/Loading';

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Project and Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProject = async () => {
            try {
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProject({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <Loading fullScreen />;

    if (!project) {
        return <Navigate to="/projects" replace />;
    }

    return (
        <div className="project-details-page">
            <div className="project-hero" style={{ // Optional: use main image as faint background or just dark header
                backgroundImage: `radial-gradient(circle at center, rgba(10,10,10,0.8), rgba(10,10,10,0.95)), url(${project.mainImage})`
            }}>
                <div className="container">
                    <div className="project-top-bar">
                        <Link to="/projects" className="back-link">
                            <ArrowLeft size={20} /> Back to Projects
                        </Link>
                        <span className="project-category-badge">{project.category}</span>
                    </div>
                    <h1 className="project-hero-title">{project.title}</h1>
                    <div className="project-location">
                        <MapPin size={18} className="location-icon" />
                        <span>{project.location}</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="project-content-grid">
                    <div className="project-description glass-panel">
                        <h2>Project Overview</h2>
                        <p>{project.description}</p>
                    </div>

                    {project.comparisons && project.comparisons.length > 0 && (
                        <div className="project-comparison">
                            <h2 className="section-subtitle text-center">Transformation</h2>
                            <div className="comparisons-list">
                                {project.comparisons.map((comp, index) => (
                                    <div key={index} className="comparison-item">
                                        {comp.label && <h3 className="comparison-label">{comp.label}</h3>}
                                        <BeforeAfterSlider
                                            beforeImage={comp.before}
                                            afterImage={comp.after}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="project-gallery section">
                    <h2 className="section-subtitle">Gallery</h2>
                    <div className="gallery-grid">
                        {project.gallery.map((img, index) => (
                            <div key={index} className="gallery-item glass-panel">
                                <img src={img} alt={`${project.title} detail ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
