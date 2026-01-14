import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Trash2, Plus, Save, Facebook, Linkedin, Instagram, Twitter, Youtube, Globe } from 'lucide-react';
import Loading from '../../components/Loading';

const AdminSocials = () => {
    const [socials, setSocials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ platform: 'Instagram', url: '' });

    const platforms = [
        { name: 'Instagram', icon: Instagram },
        { name: 'Linkedin', icon: Linkedin },
        { name: 'Facebook', icon: Facebook },
        { name: 'Twitter', icon: Twitter },
        { name: 'Youtube', icon: Youtube },
        { name: 'Website', icon: Globe },
    ];

    const fetchSocials = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "social_links"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSocials(data);
        } catch (error) {
            console.error("Error fetching social links:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSocials();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItem.url) return;

        try {
            await addDoc(collection(db, "social_links"), {
                platform: newItem.platform,
                url: newItem.url
            });
            setNewItem({ platform: 'Instagram', url: '' });
            fetchSocials();
        } catch (error) {
            console.error("Error adding social link:", error);
            alert("Failed to add link");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this link?")) return;
        try {
            await deleteDoc(doc(db, "social_links", id));
            setSocials(socials.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting link:", error);
            alert("Failed to delete link");
        }
    };

    if (loading) return <Loading text="Loading settings..." />;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Social Media Links</h1>
                <p style={{ color: 'var(--text-dim)' }}>Manage your social media links displayed in the footer.</p>
            </div>

            <div className="admin-card">
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)' }}>Platform</label>
                        <select
                            value={newItem.platform}
                            onChange={(e) => setNewItem({ ...newItem, platform: e.target.value })}
                            className="form-input"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                borderRadius: '8px'
                            }}
                        >
                            {platforms.map(p => (
                                <option key={p.name} value={p.name} style={{ background: '#333' }}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)' }}>URL</label>
                        <input
                            type="url"
                            value={newItem.url}
                            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                            placeholder="https://..."
                            className="form-input"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                borderRadius: '8px'
                            }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: '46px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> Add
                    </button>
                </form>

                <div className="socials-list">
                    {socials.length === 0 ? (
                        <p className="text-center" style={{ padding: '20px', color: 'var(--text-dim)' }}>No social links added yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {socials.map(item => {
                                const PlatformIcon = platforms.find(p => p.name === item.platform)?.icon || Globe;
                                return (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '15px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{
                                                width: '40px', height: '40px',
                                                borderRadius: '50%',
                                                background: 'rgba(212, 163, 115, 0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'var(--primary-color)'
                                            }}>
                                                <PlatformIcon size={20} />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0 }}>{item.platform}</h4>
                                                <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                                                    {item.url}
                                                </a>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{
                                                background: 'rgba(255, 50, 50, 0.1)',
                                                color: '#ff4444',
                                                border: 'none',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSocials;
