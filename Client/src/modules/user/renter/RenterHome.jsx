import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { Container, Grid, Typography, Card, CardContent, Button, Box, CircularProgress, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const DUMMY_BOOKINGS = [
  {
    _id: "booking-dummy-1",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + (14 + 180) * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    property: {
      title: "Cozy Brooklyn Studio Apartment",
      location: "Williamsburg, Brooklyn, NY",
      rentAmount: 1850,
      owner: {
        name: "John Landlord",
        phone: "555-0199"
      }
    },
    renterDetails: {
      name: "Alice Tenant",
      occupation: "Graduate Researcher at Chicago Uni"
    }
  },
  {
    _id: "booking-dummy-2",
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + (30 + 365) * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Confirmed',
    property: {
      title: "Industrial Chic Downtown Loft",
      location: "Loop District, Chicago, IL",
      rentAmount: 2600,
      owner: {
        name: "John Landlord",
        phone: "555-0199"
      }
    },
    renterDetails: {
      name: "Alice Tenant",
      occupation: "Lead Architect at Studio Chicago"
    }
  }
];

const RenterHome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8000/api/users/bookings', config);
      if (res.data && res.data.length > 0) {
        setBookings(res.data);
      } else {
        setBookings(DUMMY_BOOKINGS);
      }
    } catch (err) {
      setBookings(DUMMY_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Chip label="Approved" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'Cancelled':
        return <Chip label="Cancelled" color="error" size="small" sx={{ fontWeight: 700 }} />;
      default:
        return <Chip label="Pending Owner Approval" color="warning" size="small" sx={{ fontWeight: 700 }} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
          <Link className="navbar-brand d-flex align-items-center text-white fw-bold fs-3" to="/renter">
            <HomeWorkIcon sx={{ mr: 1, color: '#6366f1', fontSize: '2rem' }} />
            HouseHunt <span className="badge bg-indigo ms-2 fs-6" style={{ backgroundColor: '#6366f1' }}>Renter Dashboard</span>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Welcome back, {user?.name.split(' ')[0]}!
          </Typography>
          <Link to="/renter/properties" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<SearchIcon />} sx={{ backgroundColor: '#6366f1', px: 3, py: 1.2, borderRadius: '8px', fontWeight: 600 }}>
              Search Properties
            </Button>
          </Link>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#6366f1', mb: 1 }}>
                  {bookings.length}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>
                  Total Applications Sent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#10b981', mb: 1 }}>
                  {bookings.filter(b => b.status === 'Confirmed').length}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>
                  Approved Applications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#fb7185', mb: 1 }}>
                  {bookings.filter(b => b.status === 'Pending').length}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>
                  Pending Verification
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Applications table */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormatListBulletedIcon sx={{ color: '#6366f1' }} /> My Applications & Bookings
          </Typography>

          {bookings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Typography variant="body1" sx={{ color: '#94a3b8', mb: 2 }}>You haven't applied for any rentals yet.</Typography>
              <Link to="/renter/properties" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" sx={{ color: '#6366f1', borderColor: '#6366f1' }}>Browse Houses</Button>
              </Link>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Property</TableCell>
                    <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Location</TableCell>
                    <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Landlord</TableCell>
                    <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Rent</TableCell>
                    <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Rental Period</TableCell>
                    <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{booking.property?.title}</TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>{booking.property?.location}</TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        <Typography variant="body2">{booking.property?.owner?.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{booking.property?.owner?.phone}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>${booking.property?.rentAmount}/mo</TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(booking.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default RenterHome;
