import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { Container, Card, CardContent, TextField, Button, Typography, Box, Alert, MenuItem, FormGroup, FormControlLabel, Checkbox, Grid } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AMENITY_OPTIONS = ['WiFi', 'Parking', 'Pool', 'Gym', 'Pet-Friendly', 'Air Conditioning', 'Laundry', 'Furnished Kitchen', 'Balcony'];

const AddProperty = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    rentAmount: '',
    propertyType: 'Apartment',
    furnishingStatus: 'Unfurnished',
    imageUrlString: ''
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (user && !user.isApproved) {
      navigate('/owner');
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const images = formData.imageUrlString 
      ? formData.imageUrlString.split(',').map(url => url.trim()).filter(url => url !== '')
      : [];

    const propertyPayload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      rentAmount: Number(formData.rentAmount),
      propertyType: formData.propertyType,
      furnishingStatus: formData.furnishingStatus,
      amenities: selectedAmenities,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80']
    };

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:8000/api/owners/properties', propertyPayload, config);
      
      setSuccess('Property listed successfully!');
      setTimeout(() => {
        navigate('/owner/properties');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred listing property');
    } finally {
      setLoading(false);
    }
  };

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

      <Container maxWidth="md">
        <Card sx={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '20px' }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Add a New Property
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
              Fill in the form details below to list a new property for rent.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Listing Title"
                    name="title"
                    required
                    fullWidth
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Spacious 2BHK Apartment in Downtown"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Rent Amount (per month in $)"
                    name="rentAmount"
                    type="number"
                    required
                    fullWidth
                    value={formData.rentAmount}
                    onChange={handleChange}
                    placeholder="e.g. 1200"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Detailed Description"
                    name="description"
                    required
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about rooms, neighborhood, conditions..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address / Location"
                    name="location"
                    required
                    fullWidth
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Manhattan, New York"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    label="Property Type"
                    name="propertyType"
                    fullWidth
                    value={formData.propertyType}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  >
                    <MenuItem value="Apartment">Apartment</MenuItem>
                    <MenuItem value="House">House</MenuItem>
                    <MenuItem value="Condo">Condo</MenuItem>
                    <MenuItem value="Studio">Studio</MenuItem>
                    <MenuItem value="Villa">Villa</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    label="Furnishing Status"
                    name="furnishingStatus"
                    fullWidth
                    value={formData.furnishingStatus}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  >
                    <MenuItem value="Furnished">Furnished</MenuItem>
                    <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                    <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Image URL(s) (Comma-separated)"
                    name="imageUrlString"
                    fullWidth
                    value={formData.imageUrlString}
                    onChange={handleChange}
                    placeholder="e.g. https://domain.com/img1.jpg, https://domain.com/img2.jpg"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#a5b4fc' }}>
                    Amenities Included
                  </Typography>
                  <FormGroup row>
                    <Grid container spacing={1}>
                      {AMENITY_OPTIONS.map((amenity, idx) => (
                        <Grid item xs={6} sm={4} key={idx}>
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={selectedAmenities.includes(amenity)}
                                onChange={() => handleAmenityChange(amenity)}
                                sx={{ color: 'rgba(255, 255, 255, 0.3)', '&.Mui-checked': { color: '#6366f1' } }}
                              />
                            }
                            label={amenity}
                            sx={{ color: '#cbd5e1' }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 4,
                  backgroundColor: '#6366f1',
                  '&:hover': { backgroundColor: '#4f46e5' },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  float: 'right'
                }}
              >
                {loading ? 'Submitting Listing...' : 'Publish Property'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AddProperty;
