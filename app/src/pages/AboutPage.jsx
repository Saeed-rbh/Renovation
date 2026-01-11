import React, { useState, useEffect } from 'react';
import './AboutPage.css';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { aboutData as defaultAboutData } from '../data/about';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const SERVICE_ID = 'service_2diktkb';
const PUBLIC_KEY = 'wLOX4avHYtos4KMZi';
const TEMPLATE_ID = 'template_32nvlrb';

const AboutPage = () => {
    const [aboutInfo, setAboutInfo] = useState(defaultAboutData);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const docRef = doc(db, "content", "about");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setAboutInfo(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching about data:", error);
            }
        };
        fetchAboutData();
    }, []);

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1 className="hero-title">{aboutInfo.hero.title}</h1>
                    <p className="hero-subtitle">{aboutInfo.hero.subtitle}</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container about-container">
                {/* Main Glass Panel */}
                <div className="about-main glass-panel">
                    {/* Story Section */}
                    <div className="about-story">
                        <div className="story-content">
                            <h2>{aboutInfo.story.title}</h2>
                            <p>{aboutInfo.story.paragraph1}</p>
                            <p>{aboutInfo.story.paragraph2}</p>
                        </div>
                    </div>

                    {/* Inline Stats Strip */}
                    <div className="stats-strip">
                        {aboutInfo.stats.map((stat, index) => (
                            <React.Fragment key={index}>
                                <div className="stat-inline">
                                    <span className="stat-number">{stat.number}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                                {index < aboutInfo.stats.length - 1 && <div className="stat-divider"></div>}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Minimal Footer: Location & Contact */}
                    <div className="about-footer">
                        <div className="footer-item">
                            <MapPin size={18} className="footer-icon" />
                            <span>{aboutInfo.contact.address}</span>
                        </div>
                        <div className="footer-links">
                            <a href={`tel:${aboutInfo.contact.phone.replace(/\D/g, '')}`} className="footer-link">
                                <Phone size={18} />
                                <span>{aboutInfo.contact.phone}</span>
                            </a>
                            <a href={`mailto:${aboutInfo.contact.email}`} className="footer-link">
                                <Mail size={18} />
                                <span>{aboutInfo.contact.email}</span>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                    <div className="contact-section">
                        <h2>Send us a Message</h2>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // 'submitting', 'success', 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        console.log("Starting form submission...");

        const dbOp = async () => {
            console.log("Saving to Firestore...");
            // Timeout DB save after 5 seconds
            const savePromise = addDoc(collection(db, "messages"), {
                ...formData,
                createdAt: serverTimestamp(),
                read: false
            });
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Firestore save timed out")), 5000)
            );
            await Promise.race([savePromise, timeoutPromise]);
            console.log("Saved to Firestore.");
            return "db_success";
        };

        const emailOp = async () => {
            console.log("Attempting to send email...");
            const templateParams = {
                title: 'New Quote Request',
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                to_name: 'Admin',
                date: new Date().toLocaleString()
            };
            // Timeout Email after 5 seconds
            const sendPromise = emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Email send timed out")), 5000)
            );
            await Promise.race([sendPromise, timeoutPromise]);
            console.log("Email sent successfully.");
            return "email_success";
        };

        // Run both in parallel, don't let one block the other
        const results = await Promise.allSettled([dbOp(), emailOp()]);

        const dbResult = results[0];
        const emailResult = results[1];

        // Check for specific EmailJS permission 412 error
        if (emailResult.status === 'rejected' && emailResult.reason?.text?.includes("authentication scopes")) {
            alert("Admin Warning: Email permissions missing. Check console.");
        }

        // Setup success/error logic
        const dbSuccess = dbResult.status === 'fulfilled';
        const emailSuccess = emailResult.status === 'fulfilled';

        if (dbResult.status === 'rejected') console.error("DB Error:", dbResult.reason);
        if (emailResult.status === 'rejected') console.error("Email Error:", emailResult.reason);

        // If EITHER succeeded, we tell the user it worked (fail-soft)
        if (dbSuccess || emailSuccess) {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setStatus(''), 5000);

            if (!dbSuccess) console.warn("Message sent via Email only (DB failed).");
            if (!emailSuccess) console.warn("Message saved to DB only (Email failed).");
        } else {
            console.error("Both DB and Email failed.");
            setStatus('error');
            alert("Connection timed out. Please check your internet or try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input glass-input"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input glass-input"
                />
            </div>
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="form-input glass-input"
                required
            />
            <textarea
                name="message"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                className="form-input glass-input"
                required
                rows="4"
            ></textarea>

            <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={status === 'submitting'}
            >
                {status === 'submitting' ? 'Sending...' : <>Send Message <Send size={18} /></>}
            </button>

            {status === 'success' && <p className="status-msg success">Message sent successfully! We'll be in touch.</p>}
            {status === 'error' && <p className="status-msg error">Failed to send message. Please try again.</p>}
        </form>
    );
};

export default AboutPage;
