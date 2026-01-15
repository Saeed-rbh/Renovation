import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
    if (type === 'card') {
        return (
            <div className="skeleton-grid">
                {[...Array(count)].map((_, index) => (
                    <div key={index} className="skeleton-card">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-category"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

export default SkeletonLoader;
