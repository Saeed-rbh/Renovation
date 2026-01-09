import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="hero-title">Construction & Renovation</h1>
                <p className="hero-subtitle">Building Dreams, One Project at a Time</p>
                <div className="hero-buttons">
                    <a href="#projects" className="btn btn-primary">Projects</a>
                    <a href="#services" className="btn btn-outline">Our Services</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
