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
        <div className="before-after-wrapper" style={{ position: 'relative' }}>
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
                </div>

                <div
                    className="slider-handle"
                    style={{ left: `${sliderPosition}%`, zIndex: 20 }}
                >
                    <div className="handle-line"></div>
                    <div className="handle-circle">
                        <ArrowLeftRight size={20} color="#121926" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
