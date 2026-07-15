import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
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
    status: 'Available',
    imageUrlString: '',
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
      title: formData.title,
      description: formData.description,
      location: formData.location,
      rentAmount: Number(formData.rentAmount),
      propertyType: formData.propertyType,
      furnishingStatus: formData.furnishingStatus,
      status: formData.status,
      amenities: selectedAmenities,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'],
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
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <Link to="/owner" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Home size={20} />
          </div>
          <span className="font-[Poppins] text-xl font-semibold">HouseHunt</span>
        </Link>
        <Link to="/owner" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-6xl rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <Sparkles size={16} /> New listing
            </div>
            <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Add a new property</h1>
            <p className="mt-2 text-sm text-slate-600">Create a polished listing that feels as premium as the homes you’re offering.</p>
          </div>
        </div>

        {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        {success && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Listing title</label>
            <input name="title" required value={formData.title} onChange={handleChange} placeholder="Spacious 2BHK apartment near downtown" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Rent amount</label>
            <input name="rentAmount" type="number" required value={formData.rentAmount} onChange={handleChange} placeholder="1200" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Property type</label>
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} placeholder="Describe your home’s best features and neighborhood perks" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
            <input name="location" required value={formData.location} onChange={handleChange} placeholder="Mumbai, India" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
            <div className="mt-3 flex flex-wrap gap-2">
              {LOCATION_PRESETS.map((city) => (
                <button key={city} type="button" onClick={() => applyLocationPreset(city)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Furnishing status</label>
            <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Availability</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Image URL(s)</label>
            <input name="imageUrlString" value={formData.imageUrlString} onChange={handleChange} placeholder="https://domain.com/img1.jpg, https://domain.com/img2.jpg" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Amenities</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {AMENITY_OPTIONS.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="accent-blue-600" />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
              <PlusCircle size={18} /> {loading ? 'Publishing listing...' : 'Publish property'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProperty;
