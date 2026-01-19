import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, collection, getDocs } from 'firebase/firestore'; // Added collection, getDocs
import { db } from '../firebase';
import { slugify } from '../utils/helpers'; // Added slugify
import { ArrowLeft, CheckCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import './ServiceDetailsPage.css';
import Loading from '../components/Loading';
import Breadcrumbs from '../components/Breadcrumbs';

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Service and Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchService = async () => {
            try {
                // 1. Try by ID
                const docRef = doc(db, "services", id);
                const docSnap = await getDoc(docRef);

                let foundService = null;
                let foundId = id;

                if (docSnap.exists()) {
                    foundService = docSnap.data();
                } else {
                    // 2. Fallback: Slug lookup
                    const querySnapshot = await getDocs(collection(db, "services"));
                    const match = querySnapshot.docs.find(doc => slugify(doc.data().title) === id);
                    if (match) {
                        foundService = match.data();
                        foundId = match.id;
                    }
                }

                if (foundService) {
                    // Increment View Count (Session based)
                    const viewedKey = `viewed_service_${foundId}`;
                    if (!sessionStorage.getItem(viewedKey)) {
                        // Must update the REAL doc ref, not the one based on slug (id)
                        const realDocRef = doc(db, "services", foundId);
                        updateDoc(realDocRef, { views: increment(1) }).catch(e => console.error("View inc failed", e));
                        sessionStorage.setItem(viewedKey, 'true');
                    }
                    setService({ id: foundId, ...foundService });
                }
            } catch (error) {
                console.error("Error fetching service:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    if (loading) return <Loading fullScreen />;

    if (!service) {
        return <Navigate to="/services" replace />;
    }

    return (
        <PageTransition>
            <div className="service-details-page">
                <div className="service-hero" style={{
                    backgroundImage: `linear-gradient(rgba(10,10,10,0.7), rgba(10,10,10,0.9)), url(${service.image})`
                }}>
                    <div className="container">
                        <Link to="/services" className="back-link">
                            <ArrowLeft size={20} /> Back to Services
                        </Link>
                        <h1 className="service-hero-title">{service.title}</h1>
                    </div>
                </div>

                <div className="container">
                    <div style={{ marginTop: '20px' }}>
                        <Breadcrumbs items={[
                            { label: 'Services', path: '/services' },
                            { label: service.title }
                        ]} />
                    </div>
                    <div className="service-content-grid">
                        <div className="service-info glass-panel">
                            <h2>Service Description</h2>
                            <p>{service.description}</p>
                        </div>

                        <div className="service-features section">
                            <h2 className="section-subtitle">Key Features</h2>
                            <div className="features-grid">
                                {service.features.map((feature, index) => (
                                    <div key={index} className="feature-item glass-panel">
                                        <CheckCircle size={24} className="feature-icon" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-center" style={{ marginTop: '60px', marginBottom: '40px' }}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--text-light)' }}>Ready to start your project?</h3>
                        <Link to="/about" className="btn btn-primary">
                            Contact Us Today
                        </Link>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ServiceDetailsPage;
