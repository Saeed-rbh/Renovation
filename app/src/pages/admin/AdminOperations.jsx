import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { operations as initialData } from '../../data/operations'; // Import initial data for seeding
import ImageUploader from '../../components/admin/ImageUploader';
import { Link } from 'react-router-dom';

const AdminOperations = () => {
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedOps, setExpandedOps] = useState({}); // Track expanded state

    useEffect(() => {
        fetchOperations();
    }, []);

    const fetchOperations = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "operations"));
            let ops = [];
            querySnapshot.forEach((doc) => {
                ops.push({ ...doc.data(), id: doc.id });
            });

            if (ops.length === 0) {
                setOperations([]);
            } else {
                const order = ['construction', 'renovation', 'investment'];
                ops.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
                setOperations(ops);
                // Initialize expanded state (all minimized by default per user request)
                setExpandedOps({});
            }
        } catch (error) {
            console.error("Error fetching operations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeedData = async () => {
        if (!window.confirm("This will overwrite database with default data. Continue?")) return;
        setSaving(true);
        try {
            for (const op of initialData) {
                await setDoc(doc(db, "operations", op.id), op);
            }
            await fetchOperations();
            alert("Data seeded successfully!");
        } catch (error) {
            console.error("Error seeding data:", error);
            alert("Failed to seed data.");
        } finally {
            setSaving(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedOps(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleChange = (index, field, value) => {
        const newOps = [...operations];
        newOps[index] = { ...newOps[index], [field]: value };
        setOperations(newOps);
    };

    const handleContentChange = (opIndex, contentIndex, field, value) => {
        const newOps = [...operations];
        const newContent = [...newOps[opIndex].content];
        newContent[contentIndex] = { ...newContent[contentIndex], [field]: value };
        newOps[opIndex] = { ...newOps[opIndex], content: newContent };
        setOperations(newOps);
    };

    const handleAddContent = (opIndex) => {
        const newOps = [...operations];
        const currentContent = newOps[opIndex].content || [];
        newOps[opIndex] = {
            ...newOps[opIndex],
            content: [...currentContent, { heading: 'New Section', text: '' }]
        };
        setOperations(newOps);
        // Ensure card is expanded when adding
        setExpandedOps(prev => ({ ...prev, [newOps[opIndex].id]: true }));
    };

    const handleRemoveContent = (opIndex, contentIndex) => {
        if (!window.confirm("Are you sure you want to remove this section?")) return;
        const newOps = [...operations];
        const newContent = newOps[opIndex].content.filter((_, i) => i !== contentIndex);
        newOps[opIndex] = { ...newOps[opIndex], content: newContent };
        setOperations(newOps);
    };

    const handleSave = async (opIndex) => {
        const op = operations[opIndex];
        setSaving(true);
        try {
            await setDoc(doc(db, "operations", op.id), op);
            alert(`Saved ${op.title} successfully!`);
        } catch (error) {
            console.error("Error saving operation:", error);
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link to="/admin" className="back-link"><ArrowLeft size={20} /></Link>
                    <h1>Manage Operations</h1>
                </div>
            </header>

            {operations.length === 0 && (
                <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>No operations found in database.</p>
                    <button onClick={handleSeedData} className="btn btn-primary">
                        Initialize with Default Data
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gap: '30px' }}>
                {operations.map((op, index) => (
                    <div key={op.id} className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => toggleExpand(op.id)}>
                                <button className="action-btn" style={{ padding: '5px', borderRadius: '50%' }}>
                                    {expandedOps[op.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                <h2 style={{ color: 'var(--primary-color)', margin: 0, cursor: 'pointer' }}>{op.title} ({op.id})</h2>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleSave(index)}
                                    disabled={saving}
                                    className="btn btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', fontSize: '0.9rem' }}
                                >
                                    <Save size={16} /> Save
                                </button>
                            </div>
                        </div>

                        {expandedOps[op.id] && (
                            <div className="admin-card-content animate-fade-in" style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        value={op.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={op.description}
                                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                                        className="form-input"
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Main Image</label>
                                    <ImageUploader
                                        value={op.image}
                                        onChange={(url) => handleChange(index, 'image', url)}
                                        height="200px"
                                    />
                                </div>

                                <div style={{ marginTop: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Detail Content Points</h3>
                                        <button
                                            onClick={() => handleAddContent(index)}
                                            className="action-btn"
                                            style={{ color: '#00e676', borderColor: '#00e676', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <Plus size={16} /> Add Point
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        {op.content && op.content.map((item, cIndex) => (
                                            <div key={cIndex} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', position: 'relative' }}>
                                                <button
                                                    onClick={() => handleRemoveContent(index, cIndex)}
                                                    className="action-btn delete"
                                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                                                    title="Remove Section"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="form-group" style={{ marginRight: '40px' }}>
                                                    <label>Heading</label>
                                                    <input
                                                        value={item.heading}
                                                        onChange={(e) => handleContentChange(index, cIndex, 'heading', e.target.value)}
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Text</label>
                                                    <textarea
                                                        value={item.text}
                                                        onChange={(e) => handleContentChange(index, cIndex, 'text', e.target.value)}
                                                        className="form-input"
                                                        rows="3"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOperations;
