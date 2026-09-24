import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { PHONE_TEL } from '../data/business';
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <div className="logo">
                    <Link to="/" className="logo-link">


                        <img src="/homev-logo.png" alt="Homev Construction" className="secondary-logo" decoding="async" />
                    </Link>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Projects</Link>
                    <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Our Service</Link>
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>About Us</Link>
                    <Link to="/estimator" className={`nav-link ${location.pathname === '/estimator' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Get an Estimate</Link>
                    <div className="mobile-contact">
                        <a href={`tel:${PHONE_TEL}`}><Phone size={18} /> Call Us</a>
                    </div>
                </nav>

                <div className="header-actions">
                    <a href={`tel:${PHONE_TEL}`} className="action-icon desktop-only" aria-label="Call Homev Construction"><Phone size={20} /></a>
                    <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
