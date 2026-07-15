import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import AdminAddProperty from './modules/admin/AddProperty';

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

// Global Command Palette (Ctrl+K)
const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { title: 'Go to Landing Page', path: '/' },
    { title: 'Login Screen', path: '/login' },
    { title: 'Sign Up / Register', path: '/register' },
    { title: 'Renter Dashboard', path: '/renter' },
    { title: 'Search Properties', path: '/renter/properties' },
    { title: 'Owner Dashboard Home', path: '/owner' },
    { title: 'Add New Property Listing', path: '/owner/add-property' },
    { title: 'Manage Listings portfolio', path: '/owner/properties' },
    { title: 'Owner Bookings scheduler', path: '/owner/bookings' },
    { title: 'Admin System Control', path: '/admin' }
  ];

  const filtered = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center p-4 pt-[15vh] bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Command Search Hub (Ctrl+K)</span>
          <button onClick={() => setIsOpen(false)} className="text-xs text-slate-500 hover:text-slate-200">Esc to close</button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type commands or pages (e.g. 'owner', 'search')..."
          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
        />
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {filtered.map((cmd, i) => (
            <button
              key={i}
              onClick={() => {
                navigate(cmd.path);
                setIsOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-850 hover:bg-blue-600/20 hover:text-blue-400 text-xs text-slate-300 font-medium transition"
            >
              {cmd.title}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-500">No matching commands.</div>
          )}
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <>
      <CommandPalette />
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
            <ProtectedRoute allowedRoles={['renter', 'admin']}>
              <RenterHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/renter/properties" 
          element={
            <ProtectedRoute allowedRoles={['renter', 'admin']}>
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
          path="/admin/add-property" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAddProperty />
            </ProtectedRoute>
          } 
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
