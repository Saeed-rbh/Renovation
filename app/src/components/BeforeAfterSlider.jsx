import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './BeforeAfterSlider.css';
import { ArrowLeftRight } from 'lucide-react';

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMove = (clientX) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
        handleMove(e.touches[0].clientX);
    };

    const handleClick = (e) => {
        // Allow clicking to jump to position (useful for fade mode bar)
        handleMove(e.clientX);
    };

    // Global mouse up
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div className="before-after-wrapper" style={{ position: 'relative', width: '100%' }}>
            <div
                className="slider-container"
                ref={sliderRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onTouchMove={handleTouchMove}
                onClick={handleClick}
                style={{ cursor: 'col-resize' }}
                role="region"
                aria-label="Before and After comparison"
            >
                <div
                    className="img-container before-img"
                    style={{
                        zIndex: 1,
                        clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`
                    }}
                >
                    {beforeImage ? <img src={beforeImage} alt="Before" draggable="false" decoding="async" /> : <div style={{ width: '100%', height: '100%', background: '#333' }}></div>}
                    <span className="label before-label">BEFORE</span>
                </div>

                <div
                    className="img-container after-img"
                    style={{
                        zIndex: 2,
                        clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`
                    }}
                >
                    {afterImage ? <img src={afterImage} alt="After" draggable="false" decoding="async" /> : <div style={{ width: '100%', height: '100%', background: '#333' }}></div>}
                    <span className="label after-label">AFTER</span>
                    {/* Shimmer Effect */}
                    <motion.div
                        className="shimmer-effect"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: '200%', opacity: [0, 0.3, 0] }}
                        transition={{
                            repeat: Infinity,
                            repeatDelay: 3,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '50%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                            transform: 'skewX(-20deg)',
                            pointerEvents: 'none'
                        }}
                    />
                </div>

                <motion.div
                    className="slider-handle"
                    style={{ left: `${sliderPosition}%`, zIndex: 20 }}
                    animate={{ scale: isDragging ? 1.1 : 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className="handle-line"></div>
                    <motion.div
                        className="handle-circle"
                        animate={{ boxShadow: isDragging ? "0 0 0 4px rgba(255,255,255,0.3)" : "0 0 0 0px rgba(255,255,255,0)" }}
                    >
                        <ArrowLeftRight size={20} color="#121926" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
