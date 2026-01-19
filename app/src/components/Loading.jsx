import React from 'react';
import './Loading.css';

const Loading = ({ fullScreen = false, text = "Building your experience..." }) => {
    return (
        <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
            <div className="loader-content">
                <img src="/site-icon.png" alt="Loading..." className="loader-icon" />
                <div className="loading-text">
                    <img src="/loader-text.png" alt="HomeV" className="loader-text-img" />
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
