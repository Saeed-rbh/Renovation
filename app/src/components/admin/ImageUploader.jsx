import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ value, onChange, label, height = '200px' }) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a local blob URL for preview/session use
            const objectUrl = URL.createObjectURL(file);
            onChange(objectUrl);
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="form-group">
            {label && <label style={{ marginBottom: '8px', display: 'block' }}>{label}</label>}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <div
                onClick={handleClick}
                style={{
                    height: height,
                    border: '2px dashed var(--glass-border)',
                    borderRadius: '8px',
                    background: value ? `url(${value}) center/cover no-repeat` : 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                }}
                className="image-uploader-dropzone"
            >
                {!value && (
                    <div style={{ textAlign: 'center', color: 'var(--text-dim)', pointerEvents: 'none' }}>
                        <Upload size={32} style={{ marginBottom: '10px', opacity: 0.7 }} />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Click to Upload Image</p>
                    </div>
                )}

                {value && (
                    <>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            className: 'uploader-overlay'
                        }} />

                        <button
                            onClick={handleClear}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.6)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <X size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
