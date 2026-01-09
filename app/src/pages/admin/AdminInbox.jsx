import React from 'react';
import { Trash2, MailOpen } from 'lucide-react';

const AdminInbox = () => {
    // Mock Data
    const messages = [
        { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Kitchen Renovation Inquiry', date: '2023-10-25', status: 'unread' },
        { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', subject: 'Basement Quote', date: '2023-10-24', status: 'read' },
        { id: 3, name: 'Mike Ross', email: 'mike@example.com', subject: 'Bathroom Remodel', date: '2023-10-23', status: 'read' },
    ];

    return (
        <div>
            <div className="admin-header">
                <h1>Inbox</h1>
                <span style={{ color: 'var(--text-dim)' }}>3 Total Messages</span>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>From</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id}>
                                    <td>
                                        <span style={{
                                            color: msg.status === 'unread' ? '#FCD34D' : '#60A5FA',
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem'
                                        }}>
                                            {msg.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '500', color: 'var(--text-light)' }}>{msg.name}</div>
                                        <div style={{ fontSize: '0.8rem' }}>{msg.email}</div>
                                    </td>
                                    <td>{msg.subject}</td>
                                    <td>{msg.date}</td>
                                    <td>
                                        <button className="action-btn" title="View"><MailOpen size={16} /></button>
                                        <button className="action-btn delete" title="Delete"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInbox;
