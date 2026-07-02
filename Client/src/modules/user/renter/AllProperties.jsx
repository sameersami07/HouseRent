import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import AllPropertiesCards from '../AllPropertiesCards';
import { Container, Grid, Typography, Button, Box, CircularProgress, Alert, TextField, MenuItem, FormGroup, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider, useMediaQuery, Card } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';

const AMENITIES_LIST = ['WiFi', 'Parking', 'Pool', 'Gym', 'Pet-Friendly', 'Air Conditioning', 'Laundry', 'Furnished Kitchen', 'Balcony'];

const DUMMY_PROPERTIES = [
  {
    _id: "dummy-1",
    title: "Luxury Modern Villa",
    description: "Stunning luxury villa featuring a private infinity pool, massive outdoor patio, private home theater, fully equipped gym, and a beautifully landscaped garden. Located in a secure gated community in Beverly Hills.",
    location: "Beverly Hills, Los Angeles, CA",
    rentAmount: 4500,
    propertyType: "Villa",
    furnishingStatus: "Furnished",
    amenities: ["WiFi", "Parking", "Pool", "Gym", "Pet-Friendly", "Air Conditioning", "Balcony"],
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"],
    status: "Available",
    owner: {
      name: "John Landlord",
      email: "john_owner@gmail.com",
      phone: "5550199",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    }
  },
  {
    _id: "dummy-2",
    title: "Cozy Brooklyn Studio Apartment",
    description: "A charming, brick-walled studio apartment situated in the heart of Williamsburg. Steps away from subway lines, trendy restaurants, and scenic East River parks. Perfect for young professionals or students.",
    location: "Williamsburg, Brooklyn, NY",
    rentAmount: 1850,
    propertyType: "Studio",
    furnishingStatus: "Semi-Furnished",
    amenities: ["WiFi", "Laundry", "Air Conditioning"],
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"],
    status: "Available",
    owner: {
      name: "John Landlord",
      email: "john_owner@gmail.com",
      phone: "5550199",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    }
  },
  {
    _id: "dummy-3",
    title: "Industrial Chic Downtown Loft",
    description: "Spacious loft with high timber ceilings, exposed brickwork, large steel-framed windows offering breathtaking views of the city skyline. Features premium appliances and underground parking.",
    location: "Loop District, Chicago, IL",
    rentAmount: 2600,
    propertyType: "Apartment",
    furnishingStatus: "Furnished",
    amenities: ["WiFi", "Parking", "Gym", "Balcony", "Air Conditioning", "Laundry"],
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"],
    status: "Booked",
    owner: {
      name: "John Landlord",
      email: "john_owner@gmail.com",
      phone: "5550199",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    }
  },
  {
    _id: "dummy-4",
    title: "Bayside Premium Penthouse Suite",
    description: "Ultra-modern penthouse offering wrap-around floor-to-ceiling glass walls with 360-degree views of Biscayne Bay. Designer furnishing, state-of-the-art kitchen, and private elevator entry.",
    location: "Brickell Avenue, Miami, FL",
    rentAmount: 5500,
    propertyType: "Villa",
    furnishingStatus: "Furnished",
    amenities: ["WiFi", "Parking", "Pool", "Gym", "Balcony", "Air Conditioning", "Furnished Kitchen"],
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"],
    status: "Available",
    owner: {
      name: "John Landlord",
      email: "john_owner@gmail.com",
      phone: "5550199",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    }
  }
];

const AllProperties = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery('(min-width:1200px)');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters State
  const [filters, setFilters] = useState({
    location: '',
    propertyType: 'All',
    furnishingStatus: 'All',
    minPrice: '',
    maxPrice: ''
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Detail Modal & Booking Form State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    occupation: '',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const filterDummyProperties = (list) => {
    return list.filter(item => {
      if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.propertyType && filters.propertyType !== 'All' && item.propertyType !== filters.propertyType) {
        return false;
      }
      if (filters.furnishingStatus && filters.furnishingStatus !== 'All' && item.furnishingStatus !== filters.furnishingStatus) {
        return false;
      }
      if (filters.minPrice && item.rentAmount < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && item.rentAmount > Number(filters.maxPrice)) {
        return false;
      }
      if (selectedAmenities.length > 0) {
        const matchAll = selectedAmenities.every(amenity => item.amenities.includes(amenity));
        if (!matchAll) return false;
      }
      return true;
    });
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let queryParams = [];
      if (filters.location) queryParams.push(`location=${encodeURIComponent(filters.location)}`);
      if (filters.propertyType && filters.propertyType !== 'All') queryParams.push(`propertyType=${filters.propertyType}`);
      if (filters.furnishingStatus && filters.furnishingStatus !== 'All') queryParams.push(`furnishingStatus=${filters.furnishingStatus}`);
      if (filters.minPrice) queryParams.push(`minPrice=${filters.minPrice}`);
      if (filters.maxPrice) queryParams.push(`maxPrice=${filters.maxPrice}`);
      if (selectedAmenities.length > 0) queryParams.push(`amenities=${selectedAmenities.join(',')}`);
      
      const url = `http://localhost:8000/api/users/properties?${queryParams.join('&')}`;
      const res = await axios.get(url);
      if (res.data && res.data.length > 0) {
        setProperties(res.data);
      } else {
        setProperties(filterDummyProperties(DUMMY_PROPERTIES));
      }
    } catch (err) {
      setProperties(filterDummyProperties(DUMMY_PROPERTIES));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, selectedAmenities]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleOpenInfo = (property) => {
    setSelectedProperty(property);
    setBookingError('');
    setBookingSuccess('');
    setBookingForm({
      startDate: '',
      endDate: '',
      occupation: '',
      notes: ''
    });
    setOpenModal(!isLargeScreen);
  };

  const clearSelection = () => {
    setSelectedProperty(null);
    setBookingError('');
    setBookingSuccess('');
    setOpenModal(false);
  };

  const getSummary = () => {
    const count = properties.length;
    const rentValues = properties.map((item) => item.rentAmount || 0);
    const averageRent = count ? Math.round(rentValues.reduce((total, value) => total + value, 0) / count) : 0;
    const maxRent = count ? Math.max(...rentValues) : 0;
    const minRent = count ? Math.min(...rentValues) : 0;
    return { count, averageRent, maxRent, minRent };
  };

  const summary = getSummary();

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    
    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);

    const bookingPayload = {
      propertyId: selectedProperty._id,
      startDate: bookingForm.startDate,
      endDate: bookingForm.endDate,
      renterDetails: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        occupation: bookingForm.occupation,
        notes: bookingForm.notes
      }
    };

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:8000/api/users/bookings', bookingPayload, config);
      
      setBookingSuccess('Booking application submitted successfully!');
      setTimeout(() => {
        setOpenModal(false);
        navigate('/renter');
      }, 1500);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', pb: 8 }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent border-bottom border-secondary py-3 mb-5">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center text-white fw-bold fs-3" to={token && user?.userType === 'renter' ? "/renter" : "/"}>
            <HomeWorkIcon sx={{ mr: 1, color: '#6366f1', fontSize: '2rem' }} />
            HouseHunt
          </Link>
          <Link to={token && user?.userType === 'renter' ? "/renter" : "/"} style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
              Back
            </Button>
          </Link>
        </div>
      </nav>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3.5}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px', p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#818cf8' }}>
                Refine Search
              </Typography>

              <TextField
                label="City / Location"
                name="location"
                fullWidth
                variant="outlined"
                value={filters.location}
                onChange={handleFilterChange}
                sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
              />

              <TextField
                select
                label="Property Type"
                name="propertyType"
                fullWidth
                value={filters.propertyType}
                onChange={handleFilterChange}
                sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Apartment">Apartment</MenuItem>
                <MenuItem value="House">House</MenuItem>
                <MenuItem value="Condo">Condo</MenuItem>
                <MenuItem value="Studio">Studio</MenuItem>
                <MenuItem value="Villa">Villa</MenuItem>
              </TextField>

              <TextField
                select
                label="Furnishing"
                name="furnishingStatus"
                fullWidth
                value={filters.furnishingStatus}
                onChange={handleFilterChange}
                sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Furnished">Furnished</MenuItem>
                <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                <MenuItem value="Unfurnished">Unfurnished</MenuItem>
              </TextField>

              <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                <TextField
                  label="Min Price"
                  name="minPrice"
                  type="number"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField
                  label="Max Price"
                  name="maxPrice"
                  type="number"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
              </Box>

              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2.5 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#a5b4fc' }}>
                Quick search
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {['New York', 'Los Angeles', 'Miami', 'Chicago'].map((city) => (
                  <Chip
                    key={city}
                    label={city}
                    clickable
                    onClick={() => setFilters({ ...filters, location: city })}
                    sx={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#e2e8f0' }}
                  />
                ))}
              </Box>

              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2.5 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#a5b4fc' }}>
                Amenities
              </Typography>
              <FormGroup>
                {AMENITIES_LIST.map((amenity, idx) => (
                  <FormControlLabel
                    key={idx}
                    control={
                      <Checkbox 
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        size="small"
                        sx={{ color: 'rgba(255, 255, 255, 0.3)', '&.Mui-checked': { color: '#6366f1' } }}
                      />
                    }
                    label={<Typography variant="body2" sx={{ color: '#cbd5e1' }}>{amenity}</Typography>}
                  />
                ))}
              </FormGroup>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilters({ location: '', propertyType: 'All', furnishingStatus: 'All', minPrice: '', maxPrice: '' });
                  setSelectedAmenities([]);
                }}
                sx={{ mt: 3, borderColor: '#6366f1', color: '#fff', textTransform: 'none' }}
              >
                Reset Filters
              </Button>
            </Card>
          </Grid>

          {/* Properties Listings */}
          <Grid item xs={12} md={selectedProperty && isLargeScreen ? 7 : 12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  Available Properties
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {summary.count} results · Average rent ${summary.averageRent}/mo · {summary.minRent === summary.maxRent ? `Flat pricing` : `Range ${summary.minRent} - ${summary.maxRent}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={filters.location ? `Location: ${filters.location}` : 'All cities'} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#cbd5e1' }} />
                <Chip label={filters.propertyType !== 'All' ? filters.propertyType : 'All types'} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#cbd5e1' }} />
              </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#6366f1' }} />
              </Box>
            ) : properties.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Typography variant="h6" sx={{ color: '#94a3b8' }}>No properties matched your criteria.</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>Try clearing filters or selecting a different city.</Typography>
              </Box>
            ) : (
              <AllPropertiesCards 
                properties={properties} 
                onGetInfo={handleOpenInfo} 
                buttonText="View Details"
                showOwner={true}
              />
            )}
          </Grid>

          {selectedProperty && isLargeScreen && (
            <Grid item xs={12} md={5}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', position: 'sticky', top: 90, minHeight: 720 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Property Preview</Typography>
                    <Button onClick={clearSelection} size="small" sx={{ color: '#94a3b8', textTransform: 'none' }}>Clear</Button>
                  </Box>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Selected listing updates live as you browse results.</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ width: '100%', height: 240, borderRadius: '20px', overflow: 'hidden', mb: 3 }}>
                    <img
                      src={selectedProperty.images && selectedProperty.images.length > 0 ? selectedProperty.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                      alt={selectedProperty.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{selectedProperty.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2, lineHeight: 1.7 }}>{selectedProperty.description}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationOnIcon sx={{ color: '#f43f5e' }} />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>{selectedProperty.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip label={`Rent $${selectedProperty.rentAmount}/mo`} size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#a7f3d0' }} />
                    <Chip label={selectedProperty.propertyType} size="small" sx={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#c7d2fe' }} />
                    <Chip label={selectedProperty.furnishingStatus} size="small" sx={{ backgroundColor: 'rgba(148, 163, 184, 0.12)', color: '#cbd5e1' }} />
                  </Box>
                  <Box sx={{ display: 'grid', gap: 1.5, mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#a5b4fc', fontWeight: 700 }}>Amenities</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedProperty.amenities?.map((amenity, idx) => (
                        <Chip key={idx} label={amenity} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ color: '#6366f1' }} />
                      <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{selectedProperty.owner?.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CallIcon sx={{ color: '#38bdf8' }} />
                      <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{selectedProperty.owner?.phone}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#a5b4fc', fontWeight: 700, mb: 1 }}>Neighborhood Preview</Typography>
                    <Box sx={{ width: '100%', height: 220, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <iframe
                        title="sidebar-map"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(selectedProperty.location)}&output=embed`}
                        style={{ width: '100%', height: '100%', border: 0 }}
                        loading="lazy"
                      />
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => handleBookingSubmit({ preventDefault: () => {} })}
                    sx={{ py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                  >
                    Request Booking
                  </Button>
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Property Details & Booking Modal */}
      {selectedProperty && (
        <Dialog 
          open={openModal} 
          onClose={() => setOpenModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { backgroundColor: '#1e293b', color: '#fff', borderRadius: '20px', p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{selectedProperty.title}</span>
            <Chip 
              label={`$${selectedProperty.rentAmount}/mo`} 
              color="success" 
              sx={{ fontWeight: 800, fontSize: '1.1rem' }} 
            />
          </DialogTitle>
          
          <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <Grid container spacing={3}>
              {/* Property Details */}
              <Grid item xs={12} sm={6}>
                <img 
                  src={selectedProperty.images && selectedProperty.images.length > 0 ? selectedProperty.images[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"}
                  alt={selectedProperty.title}
                  style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', height: 220, marginBottom: '16px' }}
                />
                
                <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 2, lineHeight: 1.6 }}>
                  {selectedProperty.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#94a3b8', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: '#f43f5e' }} />
                  <Typography variant="body2">{selectedProperty.location}</Typography>
                </Box>
                
                <Typography variant="subtitle2" sx={{ color: '#a5b4fc', mt: 2, mb: 1, fontWeight: 700 }}>
                  Amenities:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {selectedProperty.amenities?.map((amenity, idx) => (
                    <Chip key={idx} label={amenity} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                  ))}
                </Box>

                {/* Owner Information */}
                {selectedProperty.owner && (
                  <Box sx={{ mt: 3, p: 2, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#818cf8', fontWeight: 700, mb: 1.5 }}>
                      Landlord Contact Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <img 
                        src={selectedProperty.owner.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                        alt={selectedProperty.owner.name} 
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedProperty.owner.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Verified Landlord</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, fontSize: '0.85rem' }}>
                      <EmailIcon sx={{ fontSize: '1rem', color: '#6366f1' }} /> {selectedProperty.owner.email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem' }}>
                      <CallIcon sx={{ fontSize: '1rem', color: '#38bdf8' }} /> {selectedProperty.owner.phone}
                    </Typography>
                  </Box>
                )}

                {selectedProperty.location && (
                  <Box sx={{ mt: 3, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#818cf8', fontWeight: 700, mb: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      Neighborhood Map
                    </Typography>
                    <Box sx={{ position: 'relative', width: '100%', height: 0, pb: '56.25%' }}>
                      <iframe
                        title="property-map"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(selectedProperty.location)}&output=embed`}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        loading="lazy"
                      />
                    </Box>
                  </Box>
                )}
              </Grid>
              
              {/* Booking Request Form */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#10b981' }}>
                    Rental Application Form
                  </Typography>

                  {bookingError && <Alert severity="error" sx={{ mb: 2 }}>{bookingError}</Alert>}
                  {bookingSuccess && <Alert severity="success" sx={{ mb: 2 }}>{bookingSuccess}</Alert>}

                  {!token ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                        You must log in to submit a rental booking request.
                      </Typography>
                      <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{ backgroundColor: '#6366f1' }}>Login Now</Button>
                      </Link>
                    </Box>
                  ) : (
                    <form onSubmit={handleBookingSubmit}>
                      <TextField
                        label="Full Name"
                        disabled
                        fullWidth
                        value={user?.name || ''}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#64748b', '& fieldset': { borderColor: 'rgba(255,255,255,0.05)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }}
                      />
                      <TextField
                        label="Email"
                        disabled
                        fullWidth
                        value={user?.email || ''}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#64748b', '& fieldset': { borderColor: 'rgba(255,255,255,0.05)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }}
                      />
                      <TextField
                        label="Occupation / Student Info"
                        name="occupation"
                        required
                        fullWidth
                        value={bookingForm.occupation}
                        onChange={handleBookingChange}
                        placeholder="e.g. Software Engineer at Google"
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                        <TextField
                          label="Start Date"
                          name="startDate"
                          type="date"
                          required
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={bookingForm.startDate}
                          onChange={handleBookingChange}
                          sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                        />
                        <TextField
                          label="End Date"
                          name="endDate"
                          type="date"
                          required
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={bookingForm.endDate}
                          onChange={handleBookingChange}
                          sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                        />
                      </Box>

                      <TextField
                        label="Message / Notes to Owner"
                        name="notes"
                        multiline
                        rows={3}
                        fullWidth
                        value={bookingForm.notes}
                        onChange={handleBookingChange}
                        placeholder="Say hello to the landlord and introduce yourself..."
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={bookingLoading}
                        sx={{ py: 1.2, textTransform: 'none', fontWeight: 600, fontSize: '1rem', borderRadius: '10px' }}
                      >
                        {bookingLoading ? 'Submitting Application...' : 'Send Booking Application'}
                      </Button>
                    </form>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8' }}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AllProperties;
