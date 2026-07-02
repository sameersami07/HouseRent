import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import AllPropertiesCards from '../user/AllPropertiesCards';
import { Container, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AllProperty = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProperties = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:8000/api/admin/properties', config);
        setProperties(res.data);
      } catch (err) {
        setError('Failed to fetch platform property listings');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [token, navigate]);

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
          Listed Properties Directory
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {properties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#94a3b8' }}>No properties have been listed on the platform yet.</Typography>
          </Box>
        ) : (
          <AllPropertiesCards 
            properties={properties} 
            showOwner={true}
            onGetInfo={(prop) => alert(`Property owner contact: ${prop.owner?.name} (${prop.owner?.email})`)}
            buttonText="Show Owner Details"
          />
        )}
      </Container>
    </Box>
  );
};

export default AllProperty;
