import { useState, useRef, useEffect } from 'react';
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

    const handleMouseMove = (e) => {
        if (!isDragging || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    };

    // Touch support for mobile
    const handleTouchMove = (e) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    };

    // Global mouse up to catch drag release outside component
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div
            className="slider-container"
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
        >
            <div
                className="img-container before-img"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <img src={beforeImage} alt="Before" draggable="false" />
                <span className="label before-label">BEFORE</span>
            </div>

            <div
                className="img-container after-img"
                style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
            >
                <img src={afterImage} alt="After" draggable="false" />
                <span className="label after-label">AFTER</span>
            </div>

            <div
                className="slider-handle"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="handle-line"></div>
                <div className="handle-circle">
                    <ArrowLeftRight size={20} color="#121926" />
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
