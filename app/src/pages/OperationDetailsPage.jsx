import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { operations as initialData } from '../data/operations'; // Fallback
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import './OperationDetailsPage.css';
import Breadcrumbs from '../components/Breadcrumbs';
import Loading from '../components/Loading';

const OperationDetailsPage = () => {
    const { id } = useParams();
    const [operation, setOperation] = useState(null);
    const [allOperations, setAllOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch specific operation
                const docRef = doc(db, "operations", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setOperation({ ...docSnap.data(), id: docSnap.id });
                } else {
                    // Try fallback
                    const fallback = initialData.find(op => op.id === id);
                    if (fallback) {
                        setOperation(fallback);
                    } else {
                        setNotFound(true);
                    }
                }

                // Fetch all for sidebar
                const querySnapshot = await getDocs(collection(db, "operations"));
                let ops = [];
                querySnapshot.forEach((doc) => {
                    ops.push({ ...doc.data(), id: doc.id });
                });

                if (ops.length === 0) ops = initialData; // Fallback

                setAllOperations(ops);

            } catch (error) {
                console.error("Error fetching operation details:", error);
                // Fallback on error
                const fallback = initialData.find(op => op.id === id);
                if (fallback) setOperation(fallback);
                setAllOperations(initialData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <Loading fullScreen />;
    }

    if (notFound || !operation) {
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
                            { label: 'Operations' },
                            { label: operation.title }
                        ]} />
                    </div>
                    <div className="operation-content-wrapper">
                        <div className="operation-main-content">
                            {operation.content && operation.content.map((section, index) => (
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
                                    {allOperations.filter(op => op.id !== id).map(op => (
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
