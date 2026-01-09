import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { projects as initialProjects } from '../../data/projects';
import AdminProjectEditor from './AdminProjectEditor';

const AdminProjects = () => {
    // Local state for projects to simulate persistence during session
    const [projects, setProjects] = useState(initialProjects);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    // Enter Edit Mode (New or Existing)
    const handleAdd = () => {
        setCurrentProject(null); // New project
        setIsEditing(true);
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    // Save Changes
    const handleSave = (savedProject) => {
        if (currentProject) {
            // Update existing
            setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
        } else {
            // Add new
            setProjects([...projects, { ...savedProject, id: Date.now() }]);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentProject(null);
    };

    // Render Editor if Editing
    if (isEditing) {
        return (
            <AdminProjectEditor
                project={currentProject}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );
    }

    // Render Table
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
                            {projects.map(project => (
                                <tr key={project.id}>
                                    <td>
                                        <img
                                            src={project.mainImage}
                                            alt={project.title}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </td>
                                    <td>{project.title}</td>
                                    <td>{project.category}</td>
                                    <td>{project.location}</td>
                                    <td>
                                        <button onClick={() => handleEdit(project)} className="action-btn">Edit</button>
                                        <button onClick={() => handleDelete(project.id)} className="action-btn delete">Delete</button>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProjects;
