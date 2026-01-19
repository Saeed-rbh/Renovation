import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const ImageUploader = ({ value, onChange, label, height = '200px', maxSize = 5 * 1024 * 1024 }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation: File Size
        if (file.size > maxSize) {
            alert(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validation: File Type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        try {
            setUploading(true);
            setProgress(0);

            // Create a unique filename
            const timestamp = Date.now();
            const storageRef = ref(storage, `uploads/${timestamp}_${file.name}`);

            console.log("Starting upload for:", file.name);

            // Upload to Firebase Storage with resumable upload
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Timeout safety mechanism - 60 seconds
            const timeoutId = setTimeout(() => {
                if (uploadTask.snapshot.state === 'running') {
                    console.warn("Upload timed out - cancelling.");
                    uploadTask.cancel();
                    setUploading(false);
                    setProgress(0);
                    alert("Upload timed out. Please check your internet connection and try again.");
                }
            }, 60000);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Track progress
                    const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload progress: ${progressValue}% (${snapshot.bytesTransferred}/${snapshot.totalBytes} bytes). State: ${snapshot.state}`);
                    setProgress(progressValue);
                },
                (error) => {
                    // Handle unsuccessful uploads
                    clearTimeout(timeoutId);
                    console.error("Error uploading image:", error);
                    setUploading(false);

                    if (error.code === 'storage/canceled') {
                        // Already handled by timeout or manual cancel
                        console.log("Upload was canceled.");
                    } else {
                        alert(`Failed to upload image: ${error.message}`);
                    }

                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
                async () => {
                    // Handle successful uploads on complete
                    console.log("Upload complete. Getting download URL...");
                    clearTimeout(timeoutId);
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Download URL retrieved:", downloadURL);
                        onChange(downloadURL);
                    } catch (err) {
                        console.error("Error getting download URL:", err);
                        alert("Upload completed but failed to get image URL.");
                    } finally {
                        setUploading(false);
                        setProgress(0);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                }
            );

        } catch (error) {
            console.error("Error initiating upload:", error);
            setUploading(false);
            alert("Failed to start upload.");
            if (fileInputRef.current) fileInputRef.current.value = '';
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
        if (!uploading) {
            fileInputRef.current?.click();
        }
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
                    cursor: uploading ? 'wait' : 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                }}
                className="image-uploader-dropzone"
            >
                {uploading ? (
                    <div style={{ textAlign: 'center', color: 'var(--primary-color)', background: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '8px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 size={32} className="spin-animation" />
                        <p style={{ margin: '10px 0 5px', fontSize: '0.9rem' }}>Uploading... {Math.round(progress)}%</p>
                        <div style={{ width: '80%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-color)', transition: 'width 0.2s' }} />
                        </div>
                    </div>
                ) : !value ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-dim)', pointerEvents: 'none' }}>
                        <Upload size={32} style={{ marginBottom: '10px', opacity: 0.7 }} />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Click to Upload Image</p>
                        <p style={{ margin: '5px 0 0', fontSize: '0.7rem', opacity: 0.5 }}>Max 5MB</p>
                    </div>
                ) : (
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
            <style>{`
                .spin-animation { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .image-uploader-dropzone:hover .uploader-overlay { opacity: 1 !important; }
            `}</style>
        </div>
    );
};

export default ImageUploader;
