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
            <div className="container about-container">
                {/* Main Glass Panel */}
                <div className="about-main glass-panel">
                    {/* Story Section */}
                    <div className="about-story">
                        <div className="story-content">
                            <h2>Who We Are</h2>
                            <p>
                                At HomeV Construction, we are a small, dedicated team of local craftsmen passionate about improving homes in our community. We understand that inviting a contractor into your home is a big decision, which is why we treat every project as if it were for our own family.
                            </p>
                            <p>
                                We aren't a massive corporation with call centers; when you call us, you speak to the people actually building your project. We focus on clear communication, quality work, and respecting your budget. Our goal is simple: to help our neighbors love where they live.
                            </p>
                        </div>
                    </div>

                    {/* Inline Stats Strip */}
                    <div className="stats-strip">
                        <div className="stat-inline">
                            <span className="stat-number">10+</span>
                            <span className="stat-label">Years Exp.</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-inline">
                            <span className="stat-number">250+</span>
                            <span className="stat-label">Projects</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-inline">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Happy Clients</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-inline">
                            <span className="stat-number">GTA</span>
                            <span className="stat-label">Serving Area</span>
                        </div>
                    </div>

                    {/* Minimal Footer: Location & Contact */}
                    <div className="about-footer">
                        <div className="footer-item">
                            <MapPin size={18} className="footer-icon" />
                            <span>123 Renovation Ave, Toronto, ON M5V 2T6</span>
                        </div>
                        <div className="footer-links">
                            <a href="tel:+16479612051" className="footer-link">
                                <Phone size={18} />
                                <span>+1 (647) 961-2051</span>
                            </a>
                            <a href="mailto:info@homev.ca" className="footer-link">
                                <Mail size={18} />
                                <span>info@homev.ca</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
