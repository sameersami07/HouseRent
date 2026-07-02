import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, CardContent, TextField, Button, Typography, Box, Alert } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/users/forgot-password', {
        email,
        phone,
        newPassword
      });
      setMessage(res.data.message || 'Password reset successful!');
      setEmail('');
      setPhone('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating password. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', py: 4 }}>
      <Container maxWidth="xs">
        <Card sx={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', color: '#fff', fontWeight: 800, gap: 1 }}>
                <HomeWorkIcon sx={{ color: '#6366f1', fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>HouseHunt</Typography>
              </Link>
              <Typography variant="subtitle1" sx={{ color: '#94a3b8', mt: 1 }}>
                Reset your password
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>{message}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 3,
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

              <TextField
                label="Phone Number"
                type="text"
                fullWidth
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{
                  mb: 3,
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

              <TextField
                label="New Password"
                type="password"
                fullWidth
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  mb: 3,
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  backgroundColor: '#6366f1',
                  '&:hover': { backgroundColor: '#4f46e5' },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Remember your password?{' '}
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

export default ForgotPassword;
