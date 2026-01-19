import React, { useState } from 'react';
import { FolderKanban, Briefcase, Inbox, Users } from 'lucide-react';
import { projects } from '../../data/projects';
import { services } from '../../data/services';
import { db } from '../../firebase';

const AdminDashboard = () => {
    const [visitorCount, setVisitorCount] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [popularProject, setPopularProject] = useState(null);
    const [popularService, setPopularService] = useState(null);

    // Fetch visitor stats, messages, and popular project
    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                // Dynamically import to ensure db is initialized
                const { doc, onSnapshot, collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore');
                const { db } = await import('../../firebase');

                // 1. Visitor Count (Realtime)
                const unsubVisitor = onSnapshot(doc(db, "stats", "general"), (doc) => {
                    if (doc.exists()) {
                        setVisitorCount(doc.data().visits || 0);
                    }
                });

                // 2. Unread Messages 
                try {
                    const msgsQuery = query(collection(db, "messages"));
                    getDocs(msgsQuery).then(snap => {
                        const unread = snap.docs.filter(d => !d.data().read).length;
                        setUnreadCount(unread);
                    });
                } catch (e) {
                    console.log("Error fetching messages", e);
                }

                // 3. Popular Project
                try {
                    const projectsQuery = query(collection(db, "projects"), orderBy("views", "desc"), limit(1));
                    getDocs(projectsQuery).then(snap => {
                        if (!snap.empty) {
                            const data = snap.docs[0].data();
                            setPopularProject({
                                title: data.title,
                                views: data.views || 0
                            });
                        } else {
                            getDocs(collection(db, "projects")).then(allSnap => {
                                if (!allSnap.empty) {
                                    const sorted = allSnap.docs.map(d => d.data()).sort((a, b) => (b.views || 0) - (a.views || 0));
                                    if (sorted.length > 0) {
                                        setPopularProject({
                                            title: sorted[0].title,
                                            views: sorted[0].views || 0
                                        });
                                    }
                                }
                            });
                        }
                    }).catch(async (e) => {
                        console.warn("Popular project index query failed, falling back to client-sort", e);
                        const allSnap = await getDocs(collection(db, "projects"));
                        if (!allSnap.empty) {
                            const sorted = allSnap.docs.map(d => d.data()).sort((a, b) => (b.views || 0) - (a.views || 0));
                            if (sorted.length > 0) {
                                setPopularProject({
                                    title: sorted[0].title,
                                    views: sorted[0].views || 0
                                });
                            }
                        }
                    });
                } catch (e) {
                    console.log("Error fetching popular project", e);
                }

                // 4. Popular Service
                try {
                    const servicesQuery = query(collection(db, "services"), orderBy("views", "desc"), limit(1));
                    getDocs(servicesQuery).then(snap => {
                        if (!snap.empty) {
                            const data = snap.docs[0].data();
                            setPopularService({
                                title: data.title,
                                views: data.views || 0
                            });
                        } else {
                            getDocs(collection(db, "services")).then(allSnap => {
                                if (!allSnap.empty) {
                                    const sorted = allSnap.docs.map(d => d.data()).sort((a, b) => (b.views || 0) - (a.views || 0));
                                    if (sorted.length > 0) {
                                        setPopularService({
                                            title: sorted[0].title,
                                            views: sorted[0].views || 0
                                        });
                                    }
                                }
                            });
                        }
                    }).catch(async (e) => {
                        console.warn("Popular service index query failed, falling back to client-sort");
                        const allSnap = await getDocs(collection(db, "services"));
                        if (!allSnap.empty) {
                            const sorted = allSnap.docs.map(d => d.data()).sort((a, b) => (b.views || 0) - (a.views || 0));
                            if (sorted.length > 0) {
                                setPopularService({
                                    title: sorted[0].title,
                                    views: sorted[0].views || 0
                                });
                            }
                        }
                    });
                } catch (e) {
                    console.log("Error fetching popular service", e);
                }

                return () => unsubVisitor();
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    const totalProjects = projects.length; // Note: This will eventually need to read from DB to be accurate dynamic stats
    const totalServices = services.length;


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
