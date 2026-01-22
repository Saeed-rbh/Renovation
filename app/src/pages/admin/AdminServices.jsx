import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminServiceEditor from './AdminServiceEditor';
import Loading from '../../components/Loading';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "services"));
            const servicesData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setServices(servicesData);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Enter Edit Mode
    const handleAdd = () => {
        setCurrentService(null);
        setIsEditing(true);
    };

    const handleEdit = (service) => {
        setCurrentService(service);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert("Error: Invalid service ID.");
            return;
        }

        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await deleteDoc(doc(db, "services", String(id)));
                setServices(services.filter(s => s.id !== id));
            } catch (error) {
                console.error("Error deleting service:", error);

                // Show more specific error to the user
                let errorMessage = "Failed to delete service.";
                if (error.code === 'permission-denied') {
                    errorMessage = "Permission denied: You do not have permission to delete this service.";
                } else if (error.message) {
                    errorMessage = `Error: ${error.message}`;
                }

                alert(errorMessage);
            }
        }
    };

    // Called after Editor successfully saves to DB
    const handleSave = () => {
        setIsEditing(false);
        fetchServices(); // Refresh list
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
                            {loading ? (
                                <tr>
                                    <td colSpan="4">
                                        <div style={{ padding: '40px' }}>
                                            <Loading text="Loading services..." />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
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
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminServices;
