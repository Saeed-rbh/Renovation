import React from 'react';
import './Loading.css';

const Loading = ({ fullScreen = false, text = "Building your experience..." }) => {
    return (
        <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
            <div className="loader-content">
                <div className="loading-text">
                    <img src="/homev-logo.png" alt="Homev" className="loader-logo-img" />
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
