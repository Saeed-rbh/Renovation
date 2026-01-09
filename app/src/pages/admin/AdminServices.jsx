import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { services as initialServices } from '../../data/services';
import AdminServiceEditor from './AdminServiceEditor';

const AdminServices = () => {
    const [services, setServices] = useState(initialServices);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    // Enter Edit Mode
    const handleAdd = () => {
        setCurrentService(null);
        setIsEditing(true);
    };

    const handleEdit = (service) => {
        setCurrentService(service);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    // Save Changes
    const handleSave = (savedService) => {
        if (currentService) {
            // Update existing
            setServices(services.map(s => s.id === savedService.id ? savedService : s));
        } else {
            // Add new
            setServices([...services, { ...savedService, id: Date.now() }]);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentService(null);
    };

    if (isEditing) {
        return (
            <AdminServiceEditor
                service={currentService}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );
    }

    return (
        <div>
            <div className="admin-header">
                <h1>Manage Services</h1>
                <button onClick={handleAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                    <Plus size={18} /> Add Service
                </button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Service Title</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(service => (
                                <tr key={service.id}>
                                    <td>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                                            {service.image && (
                                                <img
                                                    src={service.image}
                                                    alt=""
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: '500', color: 'var(--primary-color)' }}>{service.title}</td>
                                    <td style={{ color: 'var(--text-dim)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {service.description}
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(service)} className="action-btn">Edit</button>
                                        <button onClick={() => handleDelete(service.id)} className="action-btn delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                                        No services found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminServices;
