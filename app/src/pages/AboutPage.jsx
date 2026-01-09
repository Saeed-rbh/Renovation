import React from 'react';
import './AboutPage.css';
import { MapPin, Users, Award, Clock, Phone, Mail } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1 className="hero-title">About Us</h1>
                    <p className="hero-subtitle">Building dreams, one renovation at a time.</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="section about-content">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text glass-panel">
                            <h2>Who We Are</h2>
                            <p>
                                At HomeV Construction, we are a small, dedicated team of local craftsmen passionate about improving homes in our community. We understand that inviting a contractor into your home is a big decision, which is why we treat every project as if it were for our own family.
                            </p>
                            <p>
                                We aren't a massive corporation with call centers; when you call us, you speak to the people actually building your project. We focus on clear communication, quality work, and respecting your budget. Our goal is simple: to help our neighbors love where they live.
                            </p>
                        </div>
                        <div className="about-image glass-panel">
                            {/* Placeholder for an image */}
                            <div className="image-placeholder">
                                <span>Our Team at Work</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="section stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item glass-panel">
                            <Clock size={48} className="stat-icon" />
                            <h3>10+</h3>
                            <p>Years Experience</p>
                        </div>
                        <div className="stat-item glass-panel">
                            <Award size={48} className="stat-icon" />
                            <h3>250+</h3>
                            <p>Projects Completed</p>
                        </div>
                        <div className="stat-item glass-panel">
                            <Users size={48} className="stat-icon" />
                            <h3>100%</h3>
                            <p>Happy Clients</p>
                        </div>
                        <div className="stat-item glass-panel">
                            <MapPin size={48} className="stat-icon" />
                            <h3>GTA</h3>
                            <p>Serving Greater Toronto Area</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="section location-section">
                <div className="container">
                    <div className="location-content glass-panel">
                        <h2>Our Location</h2>
                        <p className="text-dim">We are centrally located to serve you better.</p>

                        <div className="address-box">
                            <MapPin className="location-icon" size={24} />
                            <div className="address-details">
                                <h3>Main Office</h3>
                                <p>123 Renovation Ave, Suite 100</p>
                                <p>Toronto, ON M5V 2T6</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section Integration */}
            <section className="section contact-integration">
                <div className="container">
                    <div className="glass-panel text-center contact-panel">
                        <h2>Get In Touch</h2>
                        <p className="contact-intro">Ready to start your project? Contact us for a free consultation.</p>

                        <div className="contact-methods">
                            <div className="contact-method">
                                <div className="icon-circle">
                                    <Phone />
                                </div>
                                <div>
                                    <h4>Phone</h4>
                                    <a href="tel:+16479612051" className="contact-link">+1 (647) 961-2051</a>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="icon-circle">
                                    <Mail />
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <a href="mailto:info@homev.ca" className="contact-link">info@homev.ca</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
