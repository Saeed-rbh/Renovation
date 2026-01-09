import React from 'react';
import { FolderKanban, Briefcase, Inbox, Users } from 'lucide-react';
import { projects } from '../../data/projects';
import { services } from '../../data/services';

const AdminDashboard = () => {
    // Calculate stats
    const totalProjects = projects.length;
    const totalServices = services.length;

    return (
        <div>
            <div className="admin-header">
                <h1>Dashboard Overview</h1>
                <span style={{ color: 'var(--text-dim)' }}>Welcome back, Admin</span>
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

            <div className="admin-card">
                <h3 style={{ marginBottom: '20px' }}>Recent Activity</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Item</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>New Message</td>
                            <td>Inquiry from John Doe</td>
                            <td>2 mins ago</td>
                            <td><span style={{ color: '#FCD34D' }}>Unread</span></td>
                        </tr>
                        <tr>
                            <td>Project Update</td>
                            <td>Modern Kitchen Renovation</td>
                            <td>4 hours ago</td>
                            <td><span style={{ color: '#34D399' }}>Published</span></td>
                        </tr>
                        <tr>
                            <td>New Message</td>
                            <td>Quote request for Basement</td>
                            <td>Yesterday</td>
                            <td><span style={{ color: '#60A5FA' }}>Read</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
