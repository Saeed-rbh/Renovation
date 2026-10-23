import React, { useState } from 'react';
import { FolderKanban, Briefcase, Inbox, Users } from 'lucide-react';
import { db, doc, onSnapshot, collection, getDocs } from '../../backend';

const AdminDashboard = () => {
    const [visitorCount, setVisitorCount] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [popularProject, setPopularProject] = useState(null);
    const [popularService, setPopularService] = useState(null);

    const [totalProjects, setTotalProjects] = useState(0);
    const [totalServices, setTotalServices] = useState(0);

    // Read actual migrated counts instead of the old sample-data totals.
    React.useEffect(() => {
        let active = true;
        const unsubscribe = onSnapshot(doc(db, 'stats', 'general'), snapshot => {
            if (active && snapshot.exists()) setVisitorCount(snapshot.data().visits || 0);
        });
        Promise.all(['messages', 'projects', 'services'].map(name => getDocs(collection(db, name))))
            .then(([messages, projects, services]) => {
                if (!active) return;
                setUnreadCount(messages.docs.filter(document => !document.data().read).length);
                setTotalProjects(projects.size);
                setTotalServices(services.size);
                const popular = snapshot => snapshot.docs.map(document => document.data())
                    .sort((a, b) => (b.views || 0) - (a.views || 0))[0] || null;
                setPopularProject(popular(projects));
                setPopularService(popular(services));
            }).catch(error => console.error('Error fetching dashboard:', error));
        return () => { active = false; unsubscribe(); };
    }, []);

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <span style={{ color: 'var(--text-dim)' }}>Welcome back, Admin</span>
                </div>
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
                        <Briefcase size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>3</h3>
                        <p>Operations Areas</p>
                    </div>
                </div>

                <div className="admin-card stat-card-admin">
                    <div className="stat-icon-wrapper">
                        <Inbox size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{unreadCount}</h3>
                        <p>Unread Messages</p>
                    </div>
                </div>

                <div className="admin-card stat-card-admin">
                    <div className="stat-icon-wrapper" style={{ color: '#ffd700' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{visitorCount}</h3>
                        <p>Total Visits (All Time)</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid-admin">
                {popularProject && (
                    <div className="admin-card stat-card-admin" style={{ gridColumn: 'span 2' }}>
                        <div className="stat-icon-wrapper" style={{ color: '#ff4081' }}>
                            <FolderKanban size={24} />
                        </div>
                        <div className="stat-info">
                            <p style={{ color: 'var(--primary-color)', fontWeight: '600', marginBottom: '4px' }}>Most Popular Project</p>
                            <h3 style={{ fontSize: '1.4rem' }}>{popularProject.title}</h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{popularProject.views} Views</span>
                        </div>
                    </div>
                )}

                {popularService && (
                    <div className="admin-card stat-card-admin" style={{ gridColumn: 'span 2' }}>
                        <div className="stat-icon-wrapper" style={{ color: '#00e676' }}>
                            <Briefcase size={24} />
                        </div>
                        <div className="stat-info">
                            <p style={{ color: 'var(--primary-color)', fontWeight: '600', marginBottom: '4px' }}>Most Popular Service</p>
                            <h3 style={{ fontSize: '1.4rem' }}>{popularService.title}</h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{popularService.views} Views</span>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};

export default AdminDashboard;
