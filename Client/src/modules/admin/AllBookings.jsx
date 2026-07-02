import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Typography, Button, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AllBookings = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAllBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:8000/api/admin/bookings', config);
        setBookings(res.data);
      } catch (err) {
        setError('Failed to fetch platform bookings history');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [token, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
          <Link className="navbar-brand d-flex align-items-center text-white fw-bold fs-3" to="/admin">
            <HomeWorkIcon sx={{ mr: 1, color: '#6366f1', fontSize: '2rem' }} />
            HouseHunt
          </Link>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Global Booking Audits
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {bookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#94a3b8' }}>No bookings exist in the system yet.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Property</TableCell>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Landlord / Owner</TableCell>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Tenant / Renter</TableCell>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Rental Period</TableCell>
                  <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ color: '#fff' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{booking.property?.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{booking.property?.location}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>
                      <Typography variant="body2">{booking.property?.owner?.name || 'Unknown'}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{booking.property?.owner?.phone}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>
                      <Typography variant="body2">{booking.renterDetails?.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>Occupation: {booking.renterDetails?.occupation}</Typography>
                    </TableCell>
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
      </Container>
    </Box>
  );
};

export default AllBookings;
