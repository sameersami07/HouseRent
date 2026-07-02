import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Common Components
import Home from './modules/common/Home';
import Login from './modules/common/Login';
import Register from './modules/common/Register';
import ForgotPassword from './modules/common/ForgotPassword';

// Renter Components
import RenterHome from './modules/user/renter/RenterHome';
import RenterProperties from './modules/user/renter/AllProperties';

// Owner Components
import OwnerHome from './modules/user/owner/OwnerHome';
import OwnerAddProperty from './modules/user/owner/AddProperty';
import OwnerProperties from './modules/user/owner/AllProperties';
import OwnerBookings from './modules/user/owner/AllBookings';

// Admin Components
import AdminHome from './modules/admin/AdminHome';
import AdminUsers from './modules/admin/AllUsers';
import AdminProperties from './modules/admin/AllProperty';
import AdminBookings from './modules/admin/AllBookings';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Renter Routes */}
          <Route 
            path="/renter" 
            element={
              <ProtectedRoute allowedRoles={['renter']}>
                <RenterHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/renter/properties" 
            element={
              <ProtectedRoute allowedRoles={['renter']}>
                <RenterProperties />
              </ProtectedRoute>
            } 
          />

          {/* Owner Routes */}
          <Route 
            path="/owner" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/add-property" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerAddProperty />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/properties" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerProperties />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/bookings" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerBookings />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/properties" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProperties />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBookings />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
