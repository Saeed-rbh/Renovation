import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { services } from '../data/services';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import './ServiceDetailsPage.css';

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const service = services.find(s => s.id === parseInt(id));

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

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
