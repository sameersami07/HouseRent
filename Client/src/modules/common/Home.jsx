import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Typography, Card, CardContent, Box } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent border-bottom border-secondary py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center text-white fw-bold fs-3" to="/">
            <HomeWorkIcon sx={{ mr: 1, color: '#6366f1', fontSize: '2rem' }} />
            HouseHunt
          </Link>
          <div className="d-flex gap-2">
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" sx={{ color: '#fff', borderColor: '#6366f1', '&:hover': { borderColor: '#4f46e5', backgroundColor: 'rgba(99, 102, 241, 0.1)' }, borderRadius: '8px', px: 3 }}>
                Login
              </Button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="contained" sx={{ backgroundColor: '#6366f1', color: '#fff', '&:hover': { backgroundColor: '#4f46e5' }, borderRadius: '8px', px: 3 }}>
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 10, pb: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ animation: 'fadeIn 1s ease-out' }}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, background: 'linear-gradient(to right, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
                Find Your Perfect Rental Home
              </Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 400, mb: 4, lineHeight: 1.6 }}>
                Revolutionizing how renters connect with landlords and properties. Experience a seamless rental journey with transparent details, verified properties, and immediate bookings.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" size="large" sx={{ backgroundColor: '#6366f1', color: '#fff', py: 1.5, px: 4, '&:hover': { backgroundColor: '#4f46e5' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>
                    Get Started
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#818cf8' }}>
                Join Today
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#38bdf8' }}>2k+</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Active Listings</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#34d399' }}>98%</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Renter Satisfaction</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fb7185' }}>100%</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Verified Owners</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#a78bfa' }}>24/7</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Online Support</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 15 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 8, background: 'linear-gradient(to right, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Why Choose HouseHunt?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', borderColor: '#6366f1' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.1)', mb: 3 }}>
                    <SearchIcon sx={{ color: '#6366f1', fontSize: '2rem' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Advanced Property Search
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                    Filter homes by budget, location, property size, furnishing status, and custom amenities like pools, pet policies, or garages.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', borderColor: '#38bdf8' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.1)', mb: 3 }}>
                    <TrendingUpIcon sx={{ color: '#38bdf8', fontSize: '2rem' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Real-time Market Trends
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                    Stay informed on price directions, neighbourhood analytics, transport options, school ratings, and property appreciation potential.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '16px', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', borderColor: '#34d399' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '12px', backgroundColor: 'rgba(52, 211, 153, 0.1)', mb: 3 }}>
                    <SecurityIcon sx={{ color: '#34d399', fontSize: '2rem' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Verified Stakeholders
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                    Owner accounts require strict manual verification by platform administrators, securing you against spam or fraudulent listings.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
