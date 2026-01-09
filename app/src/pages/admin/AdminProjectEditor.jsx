import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

const AdminProjectEditor = ({ project, onSave, onCancel }) => {
    // Initialize state with project data or defaults for new project
    const [formData, setFormData] = useState({
        id: project?.id || Date.now(), // Simple ID generation for new items
        title: project?.title || '',
        category: project?.category || 'Renovation',
        location: project?.location || '',
        description: project?.description || '',
        mainImage: project?.mainImage || '',
        comparisons: project?.comparisons || [],
        gallery: project?.gallery || []
    });

    // Handlers for basic fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ----- Gallery Handlers -----
    const handleAddGalleryImage = () => {
        setFormData(prev => ({
            ...prev,
            gallery: [...prev.gallery, '']
        }));
    };

    const handleGalleryChange = (index, value) => {
        // Handle both event (manual edit) and string (upload)
        const newValue = value?.target ? value.target.value : value;
        const newGallery = [...formData.gallery];
        newGallery[index] = newValue;
        setFormData(prev => ({ ...prev, gallery: newGallery }));
    };

    const handleRemoveGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    // ----- Comparison/Slider Handlers -----
    const handleAddComparison = () => {
        setFormData(prev => ({
            ...prev,
            comparisons: [...(prev.comparisons || []), { label: 'New Slider', before: '', after: '' }]
        }));
    };

    const handleComparisonChange = (index, field, value) => {
        const newComparisons = [...(formData.comparisons || [])];
        newComparisons[index] = { ...newComparisons[index], [field]: value };
        setFormData(prev => ({ ...prev, comparisons: newComparisons }));
    };

    const handleRemoveComparison = (index) => {
        setFormData(prev => ({
            ...prev,
            comparisons: prev.comparisons.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="admin-card">
            <div className="admin-header" style={{ marginBottom: '20px' }}>
                <h2>{project ? 'Edit Project' : 'New Project'}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={onCancel} className="action-btn" style={{ padding: '8px 16px' }}>
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} className="btn btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* General Info */}
                <section>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>General Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label>Project Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="form-input">
                                <option value="Renovation">Renovation</option>
                                <option value="Construction">Construction</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input name="location" value={formData.location} onChange={handleChange} className="form-input" />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Main Image</label>
                        <ImageUploader
                            value={formData.mainImage}
                            onChange={(url) => setFormData(prev => ({ ...prev, mainImage: url }))}
                            height="150px"
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="4" />
                    </div>
                </section>

                {/* Comparisons */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>
                        <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>Before / After Sliders</h3>
                        <button type="button" onClick={handleAddComparison} className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Plus size={16} /> Add Slider
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {formData.comparisons?.map((comp, index) => (
                            <div key={index} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)' }}>Slider #{index + 1}</h4>
                                    <button type="button" onClick={() => handleRemoveComparison(index)} className="action-btn delete" title="Remove Slider">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Label</label>
                                    <input value={comp.label} onChange={(e) => handleComparisonChange(index, 'label', e.target.value)} className="form-input" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="form-group">
                                        <ImageUploader
                                            label="Before Image"
                                            value={comp.before}
                                            onChange={(url) => handleComparisonChange(index, 'before', url)}
                                            height="100px"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <ImageUploader
                                            label="After Image"
                                            value={comp.after}
                                            onChange={(url) => handleComparisonChange(index, 'after', url)}
                                            height="100px"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!formData.comparisons || formData.comparisons.length === 0) && <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No comparison sliders yet.</p>}
                    </div>
                </section>

                {/* Gallery */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>
                        <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>Gallery Images</h3>
                        <button type="button" onClick={handleAddGalleryImage} className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Plus size={16} /> Add Image
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                        {formData.gallery.map((url, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <ImageUploader
                                    value={url}
                                    onChange={(newUrl) => handleGalleryChange(index, newUrl)}
                                    height="100px"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(index)}
                                    className="action-btn delete"
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        zIndex: 10,
                                        background: 'rgba(0,0,0,0.6)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '26px',
                                        height: '26px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0
                                    }}>
                                    <Trash2 size={14} color="#fff" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {formData.gallery.length === 0 && <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No gallery images yet.</p>}
                </section>

            </form>
        </div>
    );
};

export default AdminProjectEditor;
