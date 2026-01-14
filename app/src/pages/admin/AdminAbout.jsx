import React, { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { aboutData as defaultAboutData } from '../../data/about';
import Loading from '../../components/Loading';

const AdminAbout = () => {
    const [formData, setFormData] = useState(defaultAboutData);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "content", "about");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    // Initialize with default data if empty
                    await setDoc(docRef, defaultAboutData);
                }
            } catch (error) {
                console.error("Error fetching about data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleStatChange = (index, field, value) => {
        const newStats = [...formData.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setFormData(prev => ({ ...prev, stats: newStats }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, "content", "about");
            await setDoc(docRef, formData);
            alert("Changes saved to Firebase!");
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <Loading text="Loading content..." />;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="icon-circle" style={{ width: '40px', height: '40px' }}>
                        <Info size={20} />
                    </div>
                    <h1>Edit About Us</h1>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save size={18} style={{ marginRight: '8px' }} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="admin-content-grid" style={{ display: 'grid', gap: '30px' }}>

                {/* Hero Section */}
                <div className="admin-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Hero Section</h3>
                    <div className="form-group">
                        <label>Page Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.hero.title}
                            onChange={(e) => handleChange('hero', 'title', e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                        <label>Subtitle</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.hero.subtitle}
                            onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                        />
                    </div>
                </div>

                {/* Story Section */}
                <div className="admin-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Our Story</h3>
                    <div className="form-group">
                        <label>Section Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.story.title}
                            onChange={(e) => handleChange('story', 'title', e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                        <label>Paragraph 1</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            value={formData.story.paragraph1}
                            onChange={(e) => handleChange('story', 'paragraph1', e.target.value)}
                            style={{ resize: 'vertical' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                        <label>Paragraph 2</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            value={formData.story.paragraph2}
                            onChange={(e) => handleChange('story', 'paragraph2', e.target.value)}
                            style={{ resize: 'vertical' }}
                        />
                    </div>
                </div>

                {/* Stats Section */}
                <div className="admin-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Statistics</h3>
                    <div className="stats-edit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        {formData.stats.map((stat, index) => (
                            <div key={index} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', display: 'flex', gap: '20px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Value</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={stat.number}
                                        onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1, marginTop: 0 }}>
                                    <label>Label</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={stat.label}
                                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="admin-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Contact Information</h3>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.contact.address}
                            onChange={(e) => handleChange('contact', 'address', e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                        <label>Phone</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.contact.phone}
                            onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                        <label>Email</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.contact.email}
                            onChange={(e) => handleChange('contact', 'email', e.target.value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAbout;
