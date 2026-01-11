import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import './ServiceDetailsPage.css';

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Service and Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchService = async () => {
            try {
                const docRef = doc(db, "services", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setService({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching service:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    if (loading) return <div className="page-container" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

    if (!service) {
        return <Navigate to="/services" replace />;
    }

    return (
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
    );
};

export default ServiceDetailsPage;
