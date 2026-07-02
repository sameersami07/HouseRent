import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Grid, Typography, Card, CardContent, Button, Box, CircularProgress, Alert } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import DomainIcon from '@mui/icons-material/Domain';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const AdminHome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAdminStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:8000/api/admin/stats', config);
        setStats(res.data);
      } catch (err) {
        setError('Error fetching admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', pb: 8 }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent border-bottom border-secondary py-3 mb-5">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center text-white fw-bold fs-3" to="/admin">
            <HomeWorkIcon sx={{ mr: 1, color: '#6366f1', fontSize: '2rem' }} />
            HouseHunt <span className="badge bg-danger ms-2 fs-6">Admin Panel</span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Box className="d-none d-md-block text-end">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>System Administrator</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>{user?.email}</Typography>
            </Box>
            <Button onClick={handleLogout} variant="outlined" color="error" startIcon={<LogoutIcon />} sx={{ borderRadius: '8px' }}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Administrative Overview
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Highlight banner for owner verification */}
        {stats?.pendingOwners > 0 && (
          <Alert severity="info" action={
            <Link to="/admin/users" style={{ textDecoration: 'none' }}>
              <Button color="inherit" size="small" sx={{ fontWeight: 700 }}>Review Now</Button>
            </Link>
          } sx={{ mb: 4, borderRadius: '12px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Pending Landlord Registrations</Typography>
            <Typography variant="body2">There are {stats?.pendingOwners} landlord accounts awaiting manual verification and approval.</Typography>
          </Alert>
        )}

        {/* Stats cards grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Total Users</Typography>
                  <PeopleIcon sx={{ color: '#6366f1' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>{stats?.totalUsers}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {stats?.totalRenters} Renters / {stats?.totalOwners} Owners
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Total Properties</Typography>
                  <DomainIcon sx={{ color: '#38bdf8' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>{stats?.totalProperties}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Properties in Platform</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Bookings Placed</Typography>
                  <AssignmentIcon sx={{ color: '#34d399' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>{stats?.totalBookings}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Total application logs</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Verification Queue</Typography>
                  <WarningAmberIcon sx={{ color: '#e11d48' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: stats?.pendingOwners > 0 ? '#f43f5e' : '#fff' }}>
                  {stats?.pendingOwners}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Landlords pending approval</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Administration shortcuts */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Management Sections
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Link to="/admin/users" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PeopleIcon />}
                sx={{
                  py: 3,
                  borderColor: '#6366f1',
                  color: '#fff',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: '16px',
                  borderWidth: '2px',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)'
                  }
                }}
              >
                Manage User Accounts
              </Button>
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Link to="/admin/properties" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<DomainIcon />}
                sx={{
                  py: 3,
                  borderColor: '#38bdf8',
                  color: '#fff',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: '16px',
                  borderWidth: '2px',
                  backgroundColor: 'rgba(56, 189, 248, 0.05)',
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: '#0284c7',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)'
                  }
                }}
              >
                Oversee Properties
              </Button>
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Link to="/admin/bookings" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AssignmentIcon />}
                sx={{
                  py: 3,
                  borderColor: '#34d399',
                  color: '#fff',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: '16px',
                  borderWidth: '2px',
                  backgroundColor: 'rgba(52, 211, 153, 0.05)',
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: '#059669',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)'
                  }
                }}
              >
                Oversee Bookings
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminHome;
