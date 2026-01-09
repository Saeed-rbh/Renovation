import React from 'react';
import './AboutPage.css';
import { MapPin, Phone, Mail } from 'lucide-react';
import { aboutData } from '../data/about';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1 className="hero-title">{aboutData.hero.title}</h1>
                    <p className="hero-subtitle">{aboutData.hero.subtitle}</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container about-container">
                {/* Main Glass Panel */}
                <div className="about-main glass-panel">
                    {/* Story Section */}
                    <div className="about-story">
                        <div className="story-content">
                            <h2>{aboutData.story.title}</h2>
                            <p>{aboutData.story.paragraph1}</p>
                            <p>{aboutData.story.paragraph2}</p>
                        </div>
                    </div>

                    {/* Inline Stats Strip */}
                    <div className="stats-strip">
                        {aboutData.stats.map((stat, index) => (
                            <React.Fragment key={index}>
                                <div className="stat-inline">
                                    <span className="stat-number">{stat.number}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                                {index < aboutData.stats.length - 1 && <div className="stat-divider"></div>}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Minimal Footer: Location & Contact */}
                    <div className="about-footer">
                        <div className="footer-item">
                            <MapPin size={18} className="footer-icon" />
                            <span>{aboutData.contact.address}</span>
                        </div>
                        <div className="footer-links">
                            <a href={`tel:${aboutData.contact.phone.replace(/\D/g, '')}`} className="footer-link">
                                <Phone size={18} />
                                <span>{aboutData.contact.phone}</span>
                            </a>
                            <a href={`mailto:${aboutData.contact.email}`} className="footer-link">
                                <Mail size={18} />
                                <span>{aboutData.contact.email}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
