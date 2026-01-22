import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Loading from '../../components/Loading';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminProjectEditor from './AdminProjectEditor';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '8px', background: 'rgba(255,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0 }}>Something went wrong in the Project Editor.</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>{this.state.error && this.state.error.toString()}</pre>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">Reload Page</button>
                </div>
            );
        }

        return this.props.children;
    }
}

const AdminProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "projects"));
            const projectsData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setProjects(projectsData);
            console.log("Projects loaded:", projectsData);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Enter Edit Mode (New or Existing)
    const handleAdd = () => {
        setCurrentProject(null); // New project
        setIsEditing(true);
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert("Error: Invalid project ID.");
            return;
        }

        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                // Ensure ID is a string
                await deleteDoc(doc(db, "projects", String(id)));
                setProjects(projects.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting project:", error);

                // Show more specific error to the user
                let errorMessage = "Failed to delete project.";
                if (error.code === 'permission-denied') {
                    errorMessage = "Permission denied: You do not have permission to delete this project.";
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
        fetchProjects(); // Refresh list
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentProject(null);
    };

    if (isEditing) {
        return (
            <ErrorBoundary>
                <AdminProjectEditor
                    project={currentProject}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </ErrorBoundary>
        );
    }

    return (
        <div>
            <div className="admin-header">
                <h1>Manage Projects</h1>
                <button onClick={handleAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                    <Plus size={18} /> Add Project
                </button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Project Name</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan="5">
                                        <div style={{ padding: '40px' }}>
                                            <Loading text="Loading projects..." />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {projects.map(project => (
                                        <tr key={project.id}>
                                            <td>
                                                <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                                                    {project.mainImage && (
                                                        <img
                                                            src={project.mainImage}
                                                            alt={project.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: '500', color: 'var(--primary-color)' }}>{project.title}</td>
                                            <td>{project.category}</td>
                                            <td>{project.location}</td>
                                            <td>
                                                <button onClick={() => handleEdit(project)} className="action-btn">Edit</button>
                                                <button onClick={() => {
                                                    console.log("Attempting to delete project:", project);
                                                    handleDelete(project.id);
                                                }} className="action-btn delete">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {projects.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                                                No projects found.
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

export default AdminProjects;
