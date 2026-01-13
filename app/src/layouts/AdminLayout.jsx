import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Briefcase, Inbox, LogOut, Info, Globe } from 'lucide-react';
import '../pages/admin/Admin.css';

const AdminLayout = ({ isAuthenticated, onLogout }) => {

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div style={{ marginBottom: '40px', paddingLeft: '15px' }}>
                    <h3 style={{ color: 'var(--text-light)', letterSpacing: '2px' }}>ADMIN</h3>
                </div>

                <nav style={{ flex: 1 }}>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/projects" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <FolderKanban size={20} />
                        <span>Projects</span>
                    </NavLink>
                    <NavLink to="/admin/services" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Briefcase size={20} />
                        <span>Services</span>
                    </NavLink>
                    <NavLink to="/admin/about" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Info size={20} />
                        <span>About Us</span>
                    </NavLink>
                    <NavLink to="/admin/inbox" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Inbox size={20} />
                        <span>Inbox</span>
                    </NavLink>
                    <NavLink to="/admin/socials" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Globe size={20} />
                        <span>Social Media</span>
                    </NavLink>
                </nav>

                <button onClick={onLogout} className="admin-nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
