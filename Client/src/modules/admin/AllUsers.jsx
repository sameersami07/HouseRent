import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Typography, Button, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AllUsers = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8000/api/admin/users', config);
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const handleApproveOwner = async (id, currentApprovalStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8000/api/admin/users/${id}/approve`, {
        isApproved: !currentApprovalStatus
      }, config);
      fetchUsers();
    } catch (err) {
      setError('Failed to update owner verification status');
    }
  };

  const getUserTypeChip = (type) => {
    if (type === 'owner') {
      return <Chip label="Owner" color="primary" size="small" sx={{ fontWeight: 700 }} />;
    }
    return <Chip label="Renter" color="secondary" size="small" sx={{ fontWeight: 700 }} />;
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
          User Directory & Verification
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <TableRow>
                <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Profile</TableCell>
                <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Email Address</TableCell>
                <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ color: '#a5b4fc', fontWeight: 700 }}>Approval Status</TableCell>
                <TableCell align="right" sx={{ color: '#a5b4fc', fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((item) => (
                <TableRow key={item._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <img 
                      src={item.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                      alt={item.name} 
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>{item.email}</TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>{item.phone}</TableCell>
                  <TableCell>
                    {getUserTypeChip(item.userType)}
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>{item.currentLocation || 'Not Specified'}</TableCell>
                  <TableCell>
                    {item.isApproved ? (
                      <Chip label="Approved" color="success" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    ) : (
                      <Chip label="Pending" color="warning" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {item.userType === 'owner' && (
                      <Button
                        variant="contained"
                        size="small"
                        color={item.isApproved ? 'error' : 'success'}
                        onClick={() => handleApproveOwner(item._id, item.isApproved)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        {item.isApproved ? 'Revoke Approval' : 'Approve Owner'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default AllUsers;
