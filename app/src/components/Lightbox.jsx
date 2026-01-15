import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

const Lightbox = ({ images, selectedIndex, onClose, onPrev, onNext }) => {
    // Lock scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onPrev, onNext]);

    return (
        <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 2000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <button
                className="lightbox-close"
                onClick={onClose}
                aria-label="Close lightbox"
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.3s'
                }}
            >
                <X size={24} />
            </button>

            <button
                className="lightbox-nav prev"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                aria-label="Previous image"
                style={{
                    position: 'absolute',
                    left: 20,
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    zIndex: 2001
                }}
            >
                <ChevronLeft size={48} strokeWidth={1} />
            </button>

            <motion.img
                key={selectedIndex}
                src={images[selectedIndex]}
                alt="Enlarged view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                    maxWidth: '90%',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    if (swipe < -100) onNext();
                    else if (swipe > 100) onPrev();
                }}
            />

            <button
                className="lightbox-nav next"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                aria-label="Next image"
                style={{
                    position: 'absolute',
                    right: 20,
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    zIndex: 2001
                }}
            >
                <ChevronRight size={48} strokeWidth={1} />
            </button>

            <div style={{
                position: 'absolute',
                bottom: 20,
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px'
            }}>
                {selectedIndex + 1} / {images.length}
            </div>
        </motion.div>
    );
};

export default Lightbox;
