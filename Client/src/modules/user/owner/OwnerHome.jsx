import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { Container, Grid, Typography, Card, CardContent, Button, Box, Alert, CircularProgress } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const OwnerHome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProperties: 0, totalBookings: 0, pendingBookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOwnerStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch properties
        const propRes = await axios.get('http://localhost:8000/api/owners/properties', config);
        // Fetch bookings
        const bookRes = await axios.get('http://localhost:8000/api/owners/bookings', config);
        
        const props = propRes.data;
        const bookings = bookRes.data;
        
        setStats({
          totalProperties: props.length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter(b => b.status === 'Pending').length
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerStats();
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
          <Link className="navbar-brand d-flex align-items-center text-white fw-bold fs-3" to="/owner">
            <HomeWorkIcon sx={{ mr: 1, color: '#6366f1', fontSize: '2rem' }} />
            HouseHunt <span className="badge bg-indigo ms-2 fs-6" style={{ backgroundColor: '#6366f1' }}>Owner Panel</span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Box className="d-none d-md-block text-end">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>{user?.email}</Typography>
            </Box>
            <Button onClick={handleLogout} variant="outlined" color="error" startIcon={<LogoutIcon />} sx={{ borderRadius: '8px' }}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <Container maxWidth="lg">
        {/* Verification Warning */}
        {!user?.isApproved && (
          <Alert severity="warning" sx={{ mb: 4, borderRadius: '12px', '& .MuiAlert-message': { width: '100%' } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Account Verification Pending</Typography>
            <Typography variant="body2">
              Your Owner profile has not been approved by the Administrator yet. You are restricted from adding new properties or managing listings until verification is complete.
            </Typography>
          </Alert>
        )}

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Welcome back, {user?.name.split(' ')[0]}!
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                  <ListAltIcon sx={{ color: '#6366f1', fontSize: '2rem' }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.totalProperties}</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>My Listed Properties</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.1)' }}>
                  <BookOnlineIcon sx={{ color: '#38bdf8', fontSize: '2rem' }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.totalBookings}</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Total Bookings</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>
                  <PendingActionsIcon sx={{ color: '#f43f5e', fontSize: '2rem' }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.pendingBookings}</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Pending Action</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Grid */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Dashboard Shortcuts
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Link to="/owner/add-property" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                disabled={!user?.isApproved}
                startIcon={<AddCircleOutlineIcon />}
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
                Add New Property
              </Button>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Link to="/owner/properties" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ListAltIcon />}
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
                Manage My Properties
              </Button>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Link to="/owner/bookings" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BookOnlineIcon />}
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
                View Renter Bookings
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OwnerHome;
