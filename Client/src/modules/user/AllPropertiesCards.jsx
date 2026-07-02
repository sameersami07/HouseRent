import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Chip, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KingBedIcon from '@mui/icons-material/KingBed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const AllPropertiesCards = ({ properties, onGetInfo, buttonText = "Get Info", showOwner = false }) => {
  return (
    <Grid container spacing={3}>
      {properties.map((property) => (
        <Grid item xs={12} sm={6} md={4} key={property._id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: '16px',
              color: '#fff',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-6px)',
                borderColor: '#6366f1',
                boxShadow: '0 12px 24px rgba(99, 102, 241, 0.15)'
              }
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"}
              alt={property.title}
              sx={{ filter: 'brightness(0.9)' }}
            />
            
            <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={property.propertyType} 
                  size="small" 
                  sx={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontWeight: 600 }} 
                />
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 700 }}>
                  <AttachMoneyIcon sx={{ fontSize: '1.25rem' }} />
                  <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
                    {property.rentAmount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5 }}>
                    /mo
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {property.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', color: '#94a3b8', mb: 2 }}>
                <LocationOnIcon sx={{ fontSize: '1rem', mr: 0.5, color: '#f43f5e' }} />
                <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                  {property.location}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  icon={<KingBedIcon style={{ color: '#94a3b8', fontSize: '0.9rem' }} />} 
                  label={property.furnishingStatus} 
                  size="small" 
                  variant="outlined"
                  sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#94a3b8' }} 
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {property.amenities && property.amenities.slice(0, 3).map((amenity, idx) => (
                  <Chip 
                    key={idx} 
                    label={amenity} 
                    size="small" 
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', fontSize: '0.75rem' }} 
                  />
                ))}
                {property.amenities && property.amenities.length > 3 && (
                  <Chip 
                    label={`+${property.amenities.length - 3} more`} 
                    size="small" 
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#6366f1', fontSize: '0.75rem' }} 
                  />
                )}
              </Box>

              {showOwner && property.owner && (
                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <img 
                    src={property.owner.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    alt={property.owner.name} 
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.8rem' }}>
                      {property.owner.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: -0.2 }}>
                      Owner
                    </Typography>
                  </Box>
                </Box>
              )}

              {onGetInfo && (
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => onGetInfo(property)}
                  sx={{ 
                    mt: showOwner ? 2 : 'auto', 
                    py: 1, 
                    backgroundColor: property.status === 'Booked' ? '#475569' : '#6366f1',
                    '&:hover': { backgroundColor: property.status === 'Booked' ? '#475569' : '#4f46e5' },
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                  disabled={property.status === 'Booked' && buttonText === "Get Info"}
                >
                  {property.status === 'Booked' && buttonText === "Get Info" ? "Booked" : buttonText}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AllPropertiesCards;
