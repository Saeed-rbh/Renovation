import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';

const AdminInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "messages"));
            const querySnapshot = await getDocs(q);
            const msgs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setMessages(msgs);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this message?')) {
            try {
                await deleteDoc(doc(db, "messages", id));
                setMessages(messages.filter(m => m.id !== id));
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Inbox</h1>
                <div style={{ color: 'var(--text-dim)' }}>
                    {messages.length} Messages
                </div>
            </div>

            <div className="admin-card">
                <div className="inbox-list">
                    {messages.map(msg => (
                        <div key={msg.id} className={`inbox-message ${msg.read ? 'read' : 'unread'}`}>
                            <div className="message-header">
                                <div className="message-meta">
                                    <h3>{msg.name}</h3>
                                    <div className="message-contact">
                                        <span className="meta-item">
                                            <Mail size={14} /> <a href={`mailto:${msg.email}`}>{msg.email}</a>
                                        </span>
                                        {msg.phone && (
                                            <span className="meta-item">
                                                <Phone size={14} /> <a href={`tel:${msg.phone}`}>{msg.phone}</a>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="message-actions">
                                    <span className="message-date">
                                        <Calendar size={14} /> {formatDate(msg.createdAt)}
                                    </span>
                                    <button onClick={() => handleDelete(msg.id)} className="action-btn delete" title="Delete Message">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="message-body">
                                {msg.message}
                            </div>
                        </div>
                    ))}

                    {messages.length === 0 && !loading && (
                        <div className="empty-state">
                            <Mail size={48} />
                            <p>No messages yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminInbox;
