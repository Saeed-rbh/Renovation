import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3 className="footer-title">Contact Us</h3>
                        <ul className="footer-contact">
                            <li>
                                <MapPin size={20} className="footer-icon" />
                                <span>10 Westcreek Dr, Woodbridge, ON L4L 9R5, Canada</span>
                            </li>
                            <li>
                                <Mail size={20} className="footer-icon" />
                                <span>info@home-rise.com</span>
                            </li>
                            <li>
                                <Phone size={20} className="footer-icon" />
                                <span>+1 647-961-2051</span>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3 className="footer-title">Our Services</h3>
                        <ul className="footer-links">
                            <li><Link to="/services/1">Kitchen</Link></li>
                            <li><Link to="/services/2">Bathroom</Link></li>
                            <li><Link to="/services/3">Home Additions</Link></li>

                            <li><Link to="/services/5">HVAC</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3 className="footer-title">Follow Us</h3>
                        <div className="social-links">
                            <a href="#" className="social-icon"><Linkedin size={24} /></a>
                            <a href="#" className="social-icon"><Instagram size={24} /></a>
                        </div>

                    </div>
                </div>

                <div className="footer-bottom text-center">
                    <p>&copy; {new Date().getFullYear()} Home Rise Construction & Renovation. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
