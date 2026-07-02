import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Card, CardContent, TextField, Button, Typography, Box, Alert, MenuItem, Grid } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 'renter',
    currentLocation: '',
    profileImage: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/users/register', formData);
      const { token, ...userData } = res.data;
      
      login(userData, token);

      if (userData.userType === 'owner') {
        navigate('/owner');
      } else {
        navigate('/renter');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', py: 6 }}>
      <Container maxWidth="sm">
        <Card sx={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', color: '#fff', fontWeight: 800, gap: 1 }}>
                <HomeWorkIcon sx={{ color: '#6366f1', fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>HouseHunt</Typography>
              </Link>
              <Typography variant="subtitle1" sx={{ color: '#94a3b8', mt: 1 }}>
                Create a new account
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="User Type"
                    name="userType"
                    fullWidth
                    value={formData.userType}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                    }}
                  >
                    <MenuItem value="renter">Renter / Tenant</MenuItem>
                    <MenuItem value="owner">Owner / Landlord</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Current Location"
                    name="currentLocation"
                    fullWidth
                    required
                    value={formData.currentLocation}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Profile Image URL (Optional)"
                    name="profileImage"
                    fullWidth
                    value={formData.profileImage}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 4,
                  backgroundColor: '#6366f1',
                  '&:hover': { backgroundColor: '#4f46e5' },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Creating account...' : 'Register'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
