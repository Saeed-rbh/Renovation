import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Services.css';

import { services } from '../data/services';

const Services = ({ preview = false }) => {
    const displayData = preview ? services.slice(0, 3) : services;

    return (
        <section className="section services" id="services">
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
