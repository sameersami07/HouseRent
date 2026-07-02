import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { Container, Grid, Typography, Card, CardContent, Button, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AllProperties = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit Dialog State
  const [openEdit, setOpenEdit] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    rentAmount: '',
    propertyType: '',
    furnishingStatus: '',
    status: ''
  });

  const fetchProperties = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8000/api/owners/properties', config);
      setProperties(res.data);
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProperties();
  }, [token, navigate]);

  const handleStatusToggle = async (property) => {
    const nextStatus = property.status === 'Available' ? 'Booked' : 'Available';
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8000/api/owners/properties/${property._id}`, { status: nextStatus }, config);
      fetchProperties();
    } catch (err) {
      setError('Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property listing? This will also remove any related bookings.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:8000/api/owners/properties/${id}`, config);
        fetchProperties();
      } catch (err) {
        setError('Failed to delete property');
      }
    }
  };

  const handleOpenEdit = (property) => {
    setEditProperty(property);
    setEditForm({
      title: property.title,
      description: property.description,
      location: property.location,
      rentAmount: property.rentAmount,
      propertyType: property.propertyType,
      furnishingStatus: property.furnishingStatus,
      status: property.status
    });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8000/api/owners/properties/${editProperty._id}`, editForm, config);
      setOpenEdit(false);
      fetchProperties();
    } catch (err) {
      setError('Failed to update property details');
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Manage My Properties
          </Typography>
          <Link to="/owner/add-property" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: '#6366f1', color: '#fff', '&:hover': { backgroundColor: '#4f46e5' }, borderRadius: '8px' }}>
              + Add Property
            </Button>
          </Link>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {properties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 2 }}>You haven't listed any properties yet.</Typography>
            <Link to="/owner/add-property" style={{ textDecoration: 'none' }}>
              <Button variant="contained" sx={{ backgroundColor: '#6366f1' }}>List Your First Home</Button>
            </Link>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', borderRadius: '16px' }}>
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"} 
                      alt={property.title} 
                      style={{ width: '100%', height: 180, objectFit: 'cover', filter: 'brightness(0.85)' }}
                    />
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleStatusToggle(property)}
                        sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          backgroundColor: property.status === 'Available' ? '#10b981' : '#f43f5e',
                          '&:hover': { backgroundColor: property.status === 'Available' ? '#059669' : '#e11d48' }
                        }}
                      >
                        {property.status}
                      </Button>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" sx={{ color: '#818cf8', fontWeight: 600, mb: 0.5 }}>
                      {property.propertyType} • {property.furnishingStatus}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {property.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                      Rent: <strong>${property.rentAmount}</strong>/mo
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3, noWrap: true }}>
                      Location: {property.location}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<EditIcon />} 
                        onClick={() => handleOpenEdit(property)}
                        sx={{ flex: 1, color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', '&:hover': { borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.05)' } }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />} 
                        onClick={() => handleDelete(property._id)}
                        sx={{ flex: 1 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} PaperProps={{ sx: { backgroundColor: '#1e293b', color: '#fff', borderRadius: '16px', p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Property details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Property Title"
            name="title"
            fullWidth
            variant="outlined"
            value={editForm.title}
            onChange={handleEditChange}
            sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          />
          <TextField
            margin="dense"
            label="Location"
            name="location"
            fullWidth
            variant="outlined"
            value={editForm.location}
            onChange={handleEditChange}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          />
          <TextField
            margin="dense"
            label="Rent Amount"
            name="rentAmount"
            type="number"
            fullWidth
            variant="outlined"
            value={editForm.rentAmount}
            onChange={handleEditChange}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editForm.description}
            onChange={handleEditChange}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          />
          <TextField
            select
            margin="dense"
            label="Property Type"
            name="propertyType"
            fullWidth
            value={editForm.propertyType}
            onChange={handleEditChange}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          >
            <MenuItem value="Apartment">Apartment</MenuItem>
            <MenuItem value="House">House</MenuItem>
            <MenuItem value="Condo">Condo</MenuItem>
            <MenuItem value="Studio">Studio</MenuItem>
            <MenuItem value="Villa">Villa</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            label="Furnishing Status"
            name="furnishingStatus"
            fullWidth
            value={editForm.furnishingStatus}
            onChange={handleEditChange}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          >
            <MenuItem value="Furnished">Furnished</MenuItem>
            <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
            <MenuItem value="Unfurnished">Unfurnished</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            label="Status"
            name="status"
            fullWidth
            value={editForm.status}
            onChange={handleEditChange}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" sx={{ backgroundColor: '#6366f1' }}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllProperties;
