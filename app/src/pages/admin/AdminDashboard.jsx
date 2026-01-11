import React, { useState } from 'react';
import { FolderKanban, Briefcase, Inbox, Users, Database } from 'lucide-react';
import { projects } from '../../data/projects';
import { services } from '../../data/services';
import { db } from '../../firebase';
import { writeBatch, doc } from 'firebase/firestore';

const AdminDashboard = () => {
    const [seeding, setSeeding] = useState(false);

    // Calculate stats
    const totalProjects = projects.length; // Note: This will eventually need to read from DB to be accurate dynamic stats
    const totalServices = services.length;

    const handleSeedData = async () => {
        if (!window.confirm("This will overwrite/add sample data to your database. Continue?")) return;
        setSeeding(true);
        try {
            const batch = writeBatch(db);

            // Seed Projects
            projects.forEach(p => {
                const docRef = doc(db, "projects", String(p.id));
                // Remove the explicit 'id' field from data if desired, or keep it. Keeping it is fine.
                batch.set(docRef, p);
            });

            // Seed Services
            services.forEach(s => {
                const docRef = doc(db, "services", String(s.id));
                batch.set(docRef, s);
            });

            await batch.commit();
            alert("Success! Sample data added to database.");
        } catch (error) {
            console.error("Error seeding data:", error);
            alert("Failed to seed data: " + error.message);
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <span style={{ color: 'var(--text-dim)' }}>Welcome back, Admin</span>
                </div>
                <button
                    onClick={handleSeedData}
                    disabled={seeding}
                    className="btn btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Database size={18} />
                    {seeding ? 'Seeding...' : 'Reset/Seed Sample Data'}
                </button>
            </div>

            <div className="stats-grid-admin">
                <div className="admin-card stat-card-admin">
                    <div className="stat-icon-wrapper">
                        <FolderKanban size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{totalProjects}</h3>
                        <p>Total Projects</p>
                    </div>
                </div>

                <div className="admin-card stat-card-admin">
                    <div className="stat-icon-wrapper">
                        <Briefcase size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{totalServices}</h3>
                        <p>Active Services</p>
                    </div>
                </div>

                <div className="admin-card stat-card-admin">
                    <div className="stat-icon-wrapper">
                        <Inbox size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>3</h3>
                        <p>Unread Messages</p>
                    </div>
                </div>

                <div className="admin-card stat-card-admin">
                    <div className="stat-icon-wrapper">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>1.2k</h3>
                        <p>Monthly Visitors</p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default AdminDashboard;
