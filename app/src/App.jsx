import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import { isPrerender } from './data/business';
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
const EstimatorPage = React.lazy(() => import('./pages/EstimatorPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Admin Imports (Lazy Loaded)
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminServices = React.lazy(() => import('./pages/admin/AdminServices'));
const AdminInbox = React.lazy(() => import('./pages/admin/AdminInbox'));
const AdminAbout = React.lazy(() => import('./pages/admin/AdminAbout'));
const AdminSocials = React.lazy(() => import('./pages/admin/AdminSocials'));
const AdminOperations = React.lazy(() => import('./pages/admin/AdminOperations'));
const AdminEstimator = React.lazy(() => import('./pages/admin/AdminEstimator'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Visitor Counter Logic
    const incrementVisitorCount = async () => {
      const visited = sessionStorage.getItem('visited_session');
      if (!visited && !isPrerender) {
        try {
          // Dynamically import firestore functions to avoid blocking initial render
          const { doc, updateDoc, increment, setDoc, getDoc } = await import('firebase/firestore');
          const { db } = await import('./firebase');

          const statsRef = doc(db, "stats", "general");
          const statsSnap = await getDoc(statsRef);

          if (statsSnap.exists()) {
            await updateDoc(statsRef, {
              visits: increment(1)
            });
          } else {
            await setDoc(statsRef, {
              visits: 1
            });
          }

          sessionStorage.setItem('visited_session', 'true');
        } catch (error) {
          console.error("Error updating visitor count:", error);
        }
      }
    };

    incrementVisitorCount();
  }, []);

  // Only the admin panel needs login state, so public pages render right
  // away and never download Firebase Auth.
  useEffect(() => {
    if (!isAdminRoute) return;
    let unsubscribe;
    let cancelled = false;
    Promise.all([import('firebase/auth'), import('./firebaseAdmin')]).then(([{ onAuthStateChanged }, { auth }]) => {
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthenticated(!!user);
        setAuthChecked(true);
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isAdminRoute]);

  const handleLogout = async () => {
    try {
      const [{ signOut }, { auth }] = await Promise.all([import('firebase/auth'), import('./firebaseAdmin')]);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isAdminRoute && !authChecked) return <Loading fullScreen />;

  return (
    <div className="app">
      <Suspense fallback={<Loading fullScreen />}>
        {!isAdminRoute && <Header />}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailsPage />} />
            <Route path="/operations/:id" element={<OperationDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/estimator" element={<EstimatorPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="operations" element={<AdminOperations />} />
              <Route path="inbox" element={<AdminInbox />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="socials" element={<AdminSocials />} />
              <Route path="estimator" element={<AdminEstimator />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
        {!isAdminRoute && <Footer />}
      </Suspense>
      <ScrollToTop />
    </div>
  );
}

export default App;
