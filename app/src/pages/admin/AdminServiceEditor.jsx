import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

const AdminServiceEditor = ({ service, onSave, onCancel }) => {
    // Initialize state with service data or defaults
    const [formData, setFormData] = useState({
        id: service?.id || Date.now(),
        title: service?.title || '',
        description: service?.description || '',
        image: service?.image || '', // Using 'image' field from schema
        features: service?.features || []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ----- Feature List Handlers -----
    const handleAddFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="admin-card">
            <div className="admin-header" style={{ marginBottom: '20px' }}>
                <h2>{service ? 'Edit Service' : 'New Service'}</h2>
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

                {/* Main Info */}
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label>Service Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input"
                                style={{ flex: 1, resize: 'vertical', minHeight: '120px' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Service Image/Icon</label>
                        <ImageUploader
                            value={formData.image}
                            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            height="250px"
                        />
                    </div>
                </section>

                {/* Features List */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>
                        <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>Included Features</h3>
                        <button type="button" onClick={handleAddFeature} className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Plus size={16} /> Add Feature
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                        {formData.features.map((feature, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    className="form-input"
                                    placeholder="Feature description..."
                                />
                                <button type="button" onClick={() => handleRemoveFeature(index)} className="action-btn delete" style={{ margin: 0 }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    {formData.features.length === 0 && <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No features listed.</p>}
                </section>

            </form>
        </div>
    );
};

export default AdminServiceEditor;
