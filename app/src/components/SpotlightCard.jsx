import { useRef } from 'react';
import './SpotlightCard.css';

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(201, 160, 119, 0.15)", ...props }) => {
    const divRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        divRef.current.style.setProperty('--mouse-x', `${x}px`);
        divRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            className={`spotlight-card ${className}`}
            style={{
                '--spotlight-color': spotlightColor,
                '--mouse-x': '50%',
                '--mouse-y': '50%'
            }}
            {...props}
        >
            <div className="spotlight-overlay" />
            {children}
        </div>
    );
};

export default SpotlightCard;
