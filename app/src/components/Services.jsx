import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
                <motion.div
                    className="section-header text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="section-title">Our Services</h2>
                    <div className="section-divider"></div>
                </motion.div>

                <div className="services-grid">
                    {displayData.map((service, index) => (
                        <Link to={`/services/${service.id}`} key={service.id} className="service-card-link">
                            <motion.div
                                className="service-card"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -10 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
                            >
                                <div className="service-image-wrapper">
                                    <img src={service.image} alt={service.title} className="service-image" loading="lazy" />
                                </div>
                                <div className="service-info">
                                    <h3 className="service-title">{service.title}</h3>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
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
                        <Link to="/services" className="btn btn-primary">
                            View All Services <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Services;
