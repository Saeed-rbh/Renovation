import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Services.css';

const Services = ({ preview = false }) => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "services"));
                const servicesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setServices(servicesData);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchServices();
    }, []);

    const displayData = services;

    return (
        <section className={`section services ${preview ? 'home-preview' : ''}`} id="services">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Our Services</h2>
                    <div className="section-divider"></div>
                </div>

                <div className="services-grid">
                    {displayData.map((service) => (
                        <Link to={`/services/${service.id}`} key={service.id} className="service-card-link">
                            <div className="service-card">
                                <div className="service-image-wrapper">
                                    <img src={service.image} alt={service.title} className="service-image" />
                                </div>
                                <div className="service-info">
                                    <h3 className="service-title">{service.title}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {preview && (
                    <div className="text-center" style={{ marginTop: '40px' }}>
                        <Link to="/services" className="btn btn-primary">
                            View All Services <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Services;
