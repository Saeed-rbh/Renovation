import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

// Pages (Lazy Loaded)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailsPage = React.lazy(() => import('./pages/ProjectDetailsPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const ServiceDetailsPage = React.lazy(() => import('./pages/ServiceDetailsPage'));
const OperationDetailsPage = React.lazy(() => import('./pages/OperationDetailsPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));

// Admin Imports (Lazy Loaded)
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminServices = React.lazy(() => import('./pages/admin/AdminServices'));
const AdminInbox = React.lazy(() => import('./pages/admin/AdminInbox'));
const AdminAbout = React.lazy(() => import('./pages/admin/AdminAbout'));
const AdminSocials = React.lazy(() => import('./pages/admin/AdminSocials'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      <Suspense fallback={<Loading fullScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailsPage />} />
            <Route path="/operations/:id" element={<OperationDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="inbox" element={<AdminInbox />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="socials" element={<AdminSocials />} />
            </Route>

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      {!isAdminRoute && <Footer />}
      <ScrollToTop />
    </div>
  );
}

export default App;
