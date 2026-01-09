import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import OperationDetailsPage from './pages/OperationDetailsPage';
import AboutPage from './pages/AboutPage';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminServices from './pages/admin/AdminServices';
import AdminInbox from './pages/admin/AdminInbox';
import AdminAbout from './pages/admin/AdminAbout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/operations/:id" element={<OperationDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="/admin" element={<AdminLayout isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="inbox" element={<AdminInbox />} />
          <Route path="about" element={<AdminAbout />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
