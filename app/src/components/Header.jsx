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
                        <img src="/logo.png" alt="HomeV Construction" className="logo-image" />
                        <div className="logo-text-wrapper">
                            <span className="logo-brand">HOME<span className="logo-highlight">V</span></span>
                            <span className="logo-tagline">CONSTRUCTION</span>
                        </div>
                    </Link>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}>Projects</Link>
                    <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Our Service</Link>
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
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
