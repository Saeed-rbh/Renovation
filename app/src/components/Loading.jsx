import React from 'react';
import './Loading.css';

const Loading = ({ fullScreen = false, text = "Building your experience..." }) => {
    return (
        <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
            <div className="loader-content">
                <div className="hammer-loader">
                    <div className="hammer"></div>
                </div>
                <div className="loading-text">
                    <span className="brand-text">HOME<span className="highlight">V</span></span>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
