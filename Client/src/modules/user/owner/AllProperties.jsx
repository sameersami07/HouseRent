import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button as MuiButton } from '@mui/material';
import { ArrowLeft, Building2, Edit3, Trash2, PlusCircle, Sparkles } from 'lucide-react';

const AllProperties = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openEdit, setOpenEdit] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    rentAmount: '',
    propertyType: '',
    furnishingStatus: '',
    status: '',
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
      status: property.status,
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
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] text-slate-700">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-8 py-6 shadow-xl backdrop-blur">Loading your listings…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-7xl items-center justify-between rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <Link to="/owner" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Building2 size={20} />
          </div>
          <span className="font-[Poppins] text-xl font-semibold">HouseHunt</span>
        </Link>
        <Link to="/owner" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[24px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <Sparkles size={16} /> Listing control center
            </div>
            <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Manage your properties</h1>
            <p className="mt-2 text-sm text-slate-600">Edit details, adjust availability, and organize your portfolio with ease.</p>
          </div>
          <Link to="/owner/add-property" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01]">
            <PlusCircle size={18} /> Add property
          </Link>
        </div>

        {error && <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

        {properties.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm">
            <h2 className="font-[Poppins] text-xl font-semibold text-slate-900">No listings yet</h2>
            <p className="mt-2 text-sm text-slate-600">Once you publish a property, it will appear here for editing and management.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <article key={property._id} className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <img src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'} alt={property.title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{property.propertyType}</span>
                    <button onClick={() => handleStatusToggle(property)} className={`rounded-full px-3 py-1 text-xs font-semibold ${property.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {property.status}
                    </button>
                  </div>
                  <h3 className="mt-4 font-[Poppins] text-xl font-semibold text-slate-900">{property.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{property.location}</p>
                  <div className="mt-4 text-sm font-semibold text-slate-900">${property.rentAmount}/month</div>
                  <div className="mt-5 flex gap-3">
                    <button onClick={() => handleOpenEdit(property)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
                      <Edit3 size={15} /> Edit
                    </button>
                    <button onClick={() => handleDelete(property._id)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50">
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle className="font-[Poppins] text-xl font-semibold">Edit property details</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Property Title" name="title" fullWidth variant="outlined" value={editForm.title} onChange={handleEditChange} sx={{ mb: 2 }} />
          <TextField margin="dense" label="Location" name="location" fullWidth variant="outlined" value={editForm.location} onChange={handleEditChange} sx={{ mb: 2 }} />
          <TextField margin="dense" label="Rent Amount" name="rentAmount" type="number" fullWidth variant="outlined" value={editForm.rentAmount} onChange={handleEditChange} sx={{ mb: 2 }} />
          <TextField margin="dense" label="Description" name="description" fullWidth multiline rows={3} variant="outlined" value={editForm.description} onChange={handleEditChange} sx={{ mb: 2 }} />
          <TextField select margin="dense" label="Property Type" name="propertyType" fullWidth value={editForm.propertyType} onChange={handleEditChange} sx={{ mb: 2 }}>
            <MenuItem value="Apartment">Apartment</MenuItem>
            <MenuItem value="House">House</MenuItem>
            <MenuItem value="Condo">Condo</MenuItem>
            <MenuItem value="Studio">Studio</MenuItem>
            <MenuItem value="Villa">Villa</MenuItem>
          </TextField>
          <TextField select margin="dense" label="Furnishing Status" name="furnishingStatus" fullWidth value={editForm.furnishingStatus} onChange={handleEditChange} sx={{ mb: 2 }}>
            <MenuItem value="Furnished">Furnished</MenuItem>
            <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
            <MenuItem value="Unfurnished">Unfurnished</MenuItem>
          </TextField>
          <TextField select margin="dense" label="Status" name="status" fullWidth value={editForm.status} onChange={handleEditChange}>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenEdit(false)}>Cancel</MuiButton>
          <MuiButton onClick={handleEditSubmit} variant="contained" sx={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }}>Save changes</MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllProperties;
