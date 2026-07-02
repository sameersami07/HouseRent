import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { Container, Card, CardContent, Typography, Button, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AllBookings = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8000/api/owners/bookings', config);
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch booking requests');
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

  const handleUpdateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8000/api/owners/bookings/${id}`, { status }, config);
      fetchBookings();
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Chip label="Confirmed" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'Cancelled':
        return <Chip label="Cancelled" color="error" size="small" sx={{ fontWeight: 700 }} />;
      default:
        return <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 700 }} />;
    }
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
            HouseHunt
          </Link>
          <Link to="/owner" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Tenant Booking Requests
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {bookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#94a3b8' }}>No booking requests have been received yet.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Property</TableCell>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Applicant Renter</TableCell>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Contact Info</TableCell>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Rental Dates</TableCell>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ color: '#a5b4fc', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ color: '#fff' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>{booking.property?.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{booking.property?.location}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{booking.renterDetails?.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>{booking.renterDetails?.occupation || 'Not Specified'}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Email: {booking.renterDetails?.email}</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Phone: {booking.renterDetails?.phone}</Typography>
                      {booking.renterDetails?.notes && (
                        <Box sx={{ mt: 0.5, p: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                          Note: "{booking.renterDetails?.notes}"
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      <Typography variant="body2">{formatDate(booking.startDate)}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>to</Typography>
                      <Typography variant="body2">{formatDate(booking.endDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(booking.status)}
                    </TableCell>
                    <TableCell align="right">
                      {booking.status === 'Pending' ? (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button 
                            variant="contained" 
                            color="success" 
                            size="small"
                            onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="error" 
                            size="small"
                            onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            Reject
                          </Button>
                        </Box>
                      ) : (
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          size="small"
                          onClick={() => handleUpdateStatus(booking._id, 'Pending')}
                          sx={{ textTransform: 'none', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                          Reset to Pending
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default AllBookings;
