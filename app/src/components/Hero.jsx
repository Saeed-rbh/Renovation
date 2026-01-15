import './Hero.css';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);

    return (
        <section className="hero">
            <motion.div
                className="hero-bg"
                style={{ y: useTransform(scrollY, [0, 500], ["-10%", "10%"]) }} // Move from slightly up to slightly down
            />
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Construction & Renovation
                </motion.h1>
                <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    Building Dreams, One Project at a Time
                </motion.p>
                <motion.div
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <motion.a
                        href="#projects"
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Projects
                    </motion.a>
                    <motion.a
                        href="#services"
                        className="btn btn-outline"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Our Services
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
