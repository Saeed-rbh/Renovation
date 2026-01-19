import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, collection, getDocs } from 'firebase/firestore'; // Added collection, getDocs
import { db } from '../firebase';
import { projects } from '../data/projects';
import { slugify } from '../utils/helpers'; // Added slugify
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import PageTransition from '../components/PageTransition';
import { MapPin, ArrowLeft } from 'lucide-react';
import './ProjectDetailsPage.css';
import Loading from '../components/Loading';
import Lightbox from '../components/Lightbox';
import SEO from '../components/SEO';
import { AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch Project and Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProject = async () => {
            try {
                // 1. Try fetching by ID (legacy or if ID is used)
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);

                let foundProject = null;
                let foundId = id;

                if (docSnap.exists()) {
                    foundProject = docSnap.data();
                } else {
                    // 2. Fallback: Content is not found by ID. It might be a slug.
                    // Fetch all and find matching slug
                    // Note: for large DBs, this should be a query 'where("slug", "==", id)'
                    const querySnapshot = await getDocs(collection(db, "projects"));
                    const match = querySnapshot.docs.find(doc => slugify(doc.data().title) === id);
                    if (match) {
                        foundProject = match.data();
                        foundId = match.id;
                    }
                }

                if (foundProject) {
                    // Increment View Count (Session based)
                    // Note: We use the actual doc ID (foundId) for the update
                    const viewedKey = `viewed_project_${foundId}`;
                    if (!sessionStorage.getItem(viewedKey)) {
                        const realDocRef = doc(db, "projects", foundId);
                        updateDoc(realDocRef, { views: increment(1) }).catch(e => console.error("View inc failed", e));
                        sessionStorage.setItem(viewedKey, 'true');
                    }

                    // Fallback to local data if fields are missing in Firestore
                    const localData = projects.find(p => String(p.id) === foundId);

                    const mergedData = {
                        ...foundProject,
                        comparisons: (foundProject.comparisons && foundProject.comparisons.length > 0) ? foundProject.comparisons : (localData?.comparisons || []),
                        gallery: (foundProject.gallery && foundProject.gallery.length > 0) ? foundProject.gallery : (localData?.gallery || []),
                        // Ensure titles/desc are available
                        title: foundProject.title || localData?.title,
                        description: foundProject.description || localData?.description,
                        mainImage: foundProject.mainImage || localData?.mainImage,
                        category: foundProject.category || localData?.category,
                        location: foundProject.location || localData?.location
                    };

                    setProject({ id: foundId, ...mergedData });
                } else {
                    // Try local only if not in DB at all (optional, but good for local dev)
                    // Also try slug match on local data
                    const localData = projects.find(p => String(p.id) === id || slugify(p.title) === id);
                    if (localData) {
                        setProject(localData);
                    }
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
        <PageTransition>
            <SEO title={project.title} description={project.description ? project.description.substring(0, 150) + "..." : "Project details."} />
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
                    <div style={{ marginTop: '20px' }}>
                        <Breadcrumbs items={[
                            { label: 'Projects', path: '/projects' },
                            { label: project.title }
                        ]} />
                    </div>
                    <div className="project-content-grid">
                        <div className="project-description glass-panel">
                            <h2>Project Overview</h2>
                            <p>{project.description}</p>
                        </div>

                        {project.comparisons && project.comparisons.length > 0 ? (
                            <div className="project-comparison">
                                <h2 className="section-subtitle text-center">Transformation</h2>
                                <div className="comparisons-list">
                                    {project.comparisons.map((comp, index) => (
                                        <div key={index} className="comparison-item">
                                            {comp.label && <h3 className="comparison-label">{comp.label}</h3>}
                                            <BeforeAfterSlider
                                                beforeImage={comp.before || comp.beforeImage}
                                                afterImage={comp.after || comp.afterImage}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Debugging: If no comparisons, show message
                            <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #555', borderRadius: '10px' }}>
                                <p style={{ color: '#aaa' }}>No comparisons data found for this project.</p>
                                <p style={{ fontSize: '0.8rem', color: '#666' }}>Admin: Please ensure you have added a slider and saved.</p>
                            </div>
                        )}
                    </div>

                    <div className="project-gallery section">
                        <h2 className="section-subtitle">Gallery</h2>
                        <div className="gallery-grid">
                            {project.gallery.map((img, index) => (
                                <div
                                    key={index}
                                    className="gallery-item glass-panel"
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        setLightboxOpen(true);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={img} alt={`${project.title} detail ${index + 1}`} loading="lazy" decoding="async" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {lightboxOpen && (
                    <Lightbox
                        images={project.gallery}
                        selectedIndex={currentImageIndex}
                        onClose={() => setLightboxOpen(false)}
                        onPrev={() => setCurrentImageIndex(prev => (prev === 0 ? project.gallery.length - 1 : prev - 1))}
                        onNext={() => setCurrentImageIndex(prev => (prev === project.gallery.length - 1 ? 0 : prev + 1))}
                    />
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default ProjectDetailsPage;
