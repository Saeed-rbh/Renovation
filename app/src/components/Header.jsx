import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
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


                        <div className="secondary-brand">
                            <img src="/header_right.png" alt="Secondary Logo" className="secondary-logo" decoding="async" />
                            <span className="secondary-text">Construction</span>
                        </div>
                    </Link>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Projects</Link>
                    <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Our Service</Link>
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>About Us</Link>
                    <div className="mobile-contact">
                        <a href="tel:+11234567890"><Phone size={18} /> Call Us</a>
                    </div>
                </nav>

                <div className="header-actions">
                    <a href="tel:+16479612051" className="action-icon desktop-only"><Phone size={20} /></a>
                    <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
