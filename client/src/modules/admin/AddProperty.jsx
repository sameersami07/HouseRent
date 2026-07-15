import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, Home, Sparkles, PlusCircle } from 'lucide-react';

const AMENITY_OPTIONS = ['WiFi', 'Parking', 'Pool', 'Gym', 'Pet-Friendly', 'Air Conditioning', 'Laundry', 'Furnished Kitchen', 'Balcony'];
const LOCATION_PRESETS = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];

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
    googleMapUrl: '',
    latitude: '19.0760',
    longitude: '72.8777',
    imageUrlString: '',
    owner: ''
  });

  const [users, setUsers] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:8000/api/admin/users', config);
        setUsers(res.data);
        if (res.data.length > 0) {
          // Default owner to first user or current admin user
          setFormData((prev) => ({ ...prev, owner: res.data[0]._id }));
        }
      } catch (err) {
        setError('Failed to fetch platform users list');
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const applyLocationPreset = (city) => {
    setFormData((prev) => ({ ...prev, location: city }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const images = formData.imageUrlString
      ? formData.imageUrlString.split(',').map((url) => url.trim()).filter((url) => url !== '')
      : [];

    const propertyPayload = {
      owner: formData.owner,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      rentAmount: Number(formData.rentAmount),
      propertyType: formData.propertyType,
      furnishingStatus: formData.furnishingStatus,
      googleMapUrl: formData.googleMapUrl,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      amenities: selectedAmenities,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'],
    };

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:8000/api/admin/properties', propertyPayload, config);

      setSuccess('Property listed successfully by Admin!');
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred listing property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between rounded-3xl border border-slate-900 bg-slate-900/60 px-5 py-4 shadow-2xl backdrop-blur-xl">
        <Link to="/admin" className="flex items-center gap-3 text-lg font-semibold text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Home size={20} />
          </div>
          <span className="font-[Poppins] text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Enterprise Admin</span>
        </Link>
        <Link to="/admin" className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-6xl rounded-3xl border border-slate-900 bg-slate-900/40 p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
              <Sparkles size={16} /> Admin panel options
            </div>
            <h1 className="mt-3 font-[Poppins] text-3xl font-bold text-white">Add New Listing</h1>
            <p className="mt-2 text-xs text-slate-400">Directly register a new property and assign it to any platform user.</p>
          </div>
        </div>

        {error && <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-950/20 px-4 py-3 text-xs text-red-400">{error}</div>}
        {success && <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3 text-xs text-emerald-400">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Owner Assignment</label>
            <select
              name="owner"
              required
              value={formData.owner}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500"
            >
              <option value="" disabled>Select User (Owner / Renter)</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email}) - {u.userType.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Listing title</label>
            <input name="title" required value={formData.title} onChange={handleChange} placeholder="Premium 2BHK apartment with lake view" className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Rent amount (USD/mo)</label>
            <input name="rentAmount" type="number" required value={formData.rentAmount} onChange={handleChange} placeholder="1500" className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Property type</label>
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500">
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Studio">Studio</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Flat">Flat</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Description</label>
            <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} placeholder="Describe the layout, facilities, and unique perks of the listing..." className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Location / City</label>
            <input name="location" required value={formData.location} onChange={handleChange} placeholder="Hyderabad, Telangana" className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500" />
            <div className="mt-3 flex flex-wrap gap-2">
              {LOCATION_PRESETS.map((city) => (
                <button key={city} type="button" onClick={() => applyLocationPreset(city)} className="rounded-full border border-slate-800 bg-slate-950 hover:bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition">
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Google Map Location Query / Embed URL</label>
            <input name="googleMapUrl" value={formData.googleMapUrl} onChange={handleChange} placeholder="e.g. Hyderabad, India" className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500" />
            <p className="mt-1.5 text-[10px] text-slate-500">Provide the city query or latitude/longitude string to load the Google Map card.</p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Latitude</label>
            <input name="latitude" value={formData.latitude} onChange={handleChange} placeholder="19.0760" className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Longitude</label>
            <input name="longitude" value={formData.longitude} onChange={handleChange} placeholder="72.8777" className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Furnishing status</label>
            <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500">
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Image URL(s) (comma-separated)</label>
            <input name="imageUrlString" value={formData.imageUrlString} onChange={handleChange} placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..." className="w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3.5 text-xs text-white outline-none transition focus:border-blue-500" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Amenities selection</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {AMENITY_OPTIONS.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2.5 rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3 text-xs text-slate-300 cursor-pointer hover:border-slate-700 transition">
                  <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="accent-blue-600 h-4 w-4 rounded" />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:scale-[1.01] transition disabled:opacity-55 disabled:cursor-not-allowed">
              <PlusCircle size={16} /> {loading ? 'Listing Property...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProperty;
