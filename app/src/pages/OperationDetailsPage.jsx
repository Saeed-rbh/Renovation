import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { operations } from '../data/operations';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import './OperationDetailsPage.css';
import Breadcrumbs from '../components/Breadcrumbs';

const OperationDetailsPage = () => {
    const { id } = useParams();
    const operation = operations.find(op => op.id === id);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!operation) {
        return <Navigate to="/" replace />;
    }

    return (
        <PageTransition>
            <div className="operation-details-page">
                <div className="operation-hero" style={{
                    backgroundImage: `linear-gradient(rgba(10,10,10,0.6), rgba(10,10,10,0.9)), url(${operation.image})`
                }}>
                    <div className="container">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={20} /> Back to Home
                        </Link>
                        <h1 className="operation-hero-title">{operation.title}</h1>
                        <p className="operation-hero-subtitle">{operation.description}</p>
                    </div>
                </div>

                <div className="container">
                    <div style={{ marginTop: '20px' }}>
                        <Breadcrumbs items={[
                            { label: 'Operations' }, // Assuming no dedicated operations list page, just static label or home
                            { label: operation.title }
                        ]} />
                    </div>
                    <div className="operation-content-wrapper">
                        <div className="operation-main-content">
                            {operation.content.map((section, index) => (
                                <div key={index} className="content-section glass-panel">
                                    <h2>{section.heading}</h2>
                                    <p>{section.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="operation-sidebar">
                            <div className="sidebar-widget glass-panel">
                                <h3>Other Operations</h3>
                                <ul className="sidebar-nav">
                                    {operations.filter(op => op.id !== id).map(op => (
                                        <li key={op.id}>
                                            <Link to={`/operations/${op.id}`} className="sidebar-link">
                                                {op.title} <ChevronRight size={16} />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="sidebar-widget glass-panel">
                                <h3>Have a Project?</h3>
                                <p className="sidebar-text">Contact us today to discuss your vision.</p>
                                <Link to="/about" className="btn btn-primary full-width">
                                    Get in Touch
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default OperationDetailsPage;
