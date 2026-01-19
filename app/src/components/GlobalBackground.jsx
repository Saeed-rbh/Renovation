import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './GlobalBackground.css';

const GlobalBackground = () => {
    const { scrollY } = useScroll();

    // Parallax transforms
    // Move orbs slowly in opposite directions
    const y1 = useTransform(scrollY, [0, 2000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 2000], [0, -300]);

    // Rotate/Move grid slightly
    const gridY = useTransform(scrollY, [0, 2000], [0, 100]);

    return (
        <div className="global-bg">
            <div className="bg-layer-base" />

            <motion.div
                className="bg-grid"
                style={{ y: gridY }}
            />

            <motion.div
                className="bg-orb bg-orb-1"
                style={{ y: y1 }}
            />

            <motion.div
                className="bg-orb bg-orb-2"
                style={{ y: y2 }}
            />
        </div>
    );
};

export default GlobalBackground;
