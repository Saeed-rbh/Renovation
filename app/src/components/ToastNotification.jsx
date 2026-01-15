import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast = { id, message, type, duration };

        setToasts((prev) => [...prev, toast]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none'
            }}>
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle size={20} color="#10b981" />,
        error: <AlertCircle size={20} color="#ef4444" />,
        info: <Info size={20} color="#3b82f6" />
    };

    const borders = {
        success: '1px solid rgba(16, 185, 129, 0.2)',
        error: '1px solid rgba(239, 68, 68, 0.2)',
        info: '1px solid rgba(59, 130, 246, 0.2)'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            layout
            style={{
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(12px)',
                border: borders[toast.type] || borders.info,
                padding: '16px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                pointerEvents: 'auto',
                color: '#f8fafc'
            }}
        >
            {icons[toast.type] || icons.info}
            <p style={{ margin: 0, fontSize: '0.9rem', flex: 1 }}>{toast.message}</p>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default ToastNotification;
