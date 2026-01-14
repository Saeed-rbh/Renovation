import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Instagram, Facebook, Twitter, Youtube, Globe } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Footer.css';
import Loading from './Loading';

const Footer = () => {
    const [socials, setSocials] = useState([]);
    const [services, setServices] = useState([]);
    const [contact, setContact] = useState({
        address: "10 Westcreek Dr, Woodbridge, ON L4L 9R5, Canada",
        email: "info@home-rise.com",
        phone: "+1 647-961-2051"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Socials
                const socialSnap = await getDocs(collection(db, "social_links"));
                setSocials(socialSnap.docs.map(doc => doc.data()));

                // Fetch Services
                const serviceSnap = await getDocs(collection(db, "services"));
                const serviceData = serviceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(serviceData);

                // Fetch Contact Info
                const aboutDoc = await getDoc(doc(db, "content", "about"));
                if (aboutDoc.exists() && aboutDoc.data().contact) {
                    setContact(aboutDoc.data().contact);
                }

            } catch (error) {
                console.error("Error fetching footer data:", error);
            }
        };
        fetchData();
    }, []);

    const getIcon = (platform) => {
        switch (platform) {
            case 'Instagram': return Instagram;
            case 'Linkedin': return Linkedin;
            case 'Facebook': return Facebook;
            case 'Twitter': return Twitter;
            case 'Youtube': return Youtube;
            default: return Globe;
        }
    };

    return (
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3 className="footer-title">Contact Us</h3>
                        <ul className="footer-contact">
                            <li>
                                <MapPin size={20} className="footer-icon" />
                                <span>{contact.address}</span>
                            </li>
                            <li>
                                <Mail size={20} className="footer-icon" />
                                <span>{contact.email}</span>
                            </li>
                            <li>
                                <Phone size={20} className="footer-icon" />
                                <span>{contact.phone}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3 className="footer-title">Our Services</h3>
                        <ul className="footer-links">
                            {services.length > 0 ? (
                                services.map(service => (
                                    <li key={service.id}>
                                        <Link to={`/services/${service.id}`}>{service.title}</Link>
                                    </li>
                                ))
                            ) : (
                                <li><Loading text="Loading..." /></li>
                            )}
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3 className="footer-title">Follow Us</h3>
                        <div className="social-links">
                            {socials.length > 0 ? (
                                socials.map((social, index) => {
                                    const Icon = getIcon(social.platform);
                                    return (
                                        <a key={index} href={social.url} target="_blank" rel="noreferrer" className="social-icon">
                                            <Icon size={24} />
                                        </a>
                                    );
                                })
                            ) : (
                                <span style={{ color: 'var(--text-dim)' }}>No social links yet.</span>
                            )}
                        </div>

                    </div>
                </div>

                <div className="footer-bottom text-center">
                    <p>&copy; {new Date().getFullYear()} HomeV Construction & Renovation. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
