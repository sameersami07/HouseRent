import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import AllPropertiesCards from '../AllPropertiesCards';
import { ArrowLeft, Home, Building2, Sparkles, MapPin, CalendarDays, Phone, Mail } from 'lucide-react';

const AMENITIES_LIST = ['WiFi', 'Parking', 'Pool', 'Gym', 'Pet-Friendly', 'Air Conditioning', 'Laundry', 'Furnished Kitchen', 'Balcony'];

const DUMMY_PROPERTIES = [
  {
    _id: 'dummy-1',
    title: 'Luxury Modern Villa',
    description: 'Stunning luxury villa featuring a private infinity pool, massive outdoor patio, private home theater, fully equipped gym, and a beautifully landscaped garden.',
    location: 'Beverly Hills, Los Angeles, CA',
    rentAmount: 4500,
    propertyType: 'Villa',
    furnishingStatus: 'Furnished',
    amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Pet-Friendly', 'Air Conditioning', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    owner: {
      name: 'John Landlord',
      email: 'john_owner@gmail.com',
      phone: '5550199',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    _id: 'dummy-2',
    title: 'Cozy Brooklyn Studio Apartment',
    description: 'A charming studio apartment situated in the heart of Williamsburg, close to transit and local dining.',
    location: 'Williamsburg, Brooklyn, NY',
    rentAmount: 1850,
    propertyType: 'Studio',
    furnishingStatus: 'Semi-Furnished',
    amenities: ['WiFi', 'Laundry', 'Air Conditioning'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    owner: {
      name: 'John Landlord',
      email: 'john_owner@gmail.com',
      phone: '5550199',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    _id: 'dummy-3',
    title: 'Industrial Chic Downtown Loft',
    description: 'Spacious loft with high timber ceilings, exposed brickwork, and city skyline views.',
    location: 'Loop District, Chicago, IL',
    rentAmount: 2600,
    propertyType: 'Apartment',
    furnishingStatus: 'Furnished',
    amenities: ['WiFi', 'Parking', 'Gym', 'Balcony', 'Air Conditioning', 'Laundry'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    status: 'Booked',
    owner: {
      name: 'John Landlord',
      email: 'john_owner@gmail.com',
      phone: '5550199',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    _id: 'dummy-4',
    title: 'Bayside Premium Penthouse Suite',
    description: 'Ultra-modern penthouse with floor-to-ceiling glass walls and 360-degree bay views.',
    location: 'Brickell Avenue, Miami, FL',
    rentAmount: 5500,
    propertyType: 'Villa',
    furnishingStatus: 'Furnished',
    amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Balcony', 'Air Conditioning', 'Furnished Kitchen'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    owner: {
      name: 'John Landlord',
      email: 'john_owner@gmail.com',
      phone: '5550199',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  },
];

const AllProperties = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    location: '',
    propertyType: 'All',
    furnishingStatus: 'All',
    minPrice: '',
    maxPrice: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [hasAutoFilledLocation, setHasAutoFilledLocation] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    occupation: '',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const filterDummyProperties = (list) => {
    return list.filter((item) => {
      if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.propertyType && filters.propertyType !== 'All' && item.propertyType !== filters.propertyType) return false;
      if (filters.furnishingStatus && filters.furnishingStatus !== 'All' && item.furnishingStatus !== filters.furnishingStatus) return false;
      if (filters.minPrice && item.rentAmount < Number(filters.minPrice)) return false;
      if (filters.maxPrice && item.rentAmount > Number(filters.maxPrice)) return false;
      if (selectedAmenities.length > 0) {
        const matchAll = selectedAmenities.every((amenity) => item.amenities.includes(amenity));
        if (!matchAll) return false;
      }
      return true;
    });
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = [];
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
    if (user?.currentLocation && !filters.location && !hasAutoFilledLocation) {
      setFilters((prev) => ({ ...prev, location: user.currentLocation }));
      setHasAutoFilledLocation(true);
      return;
    }

    fetchProperties();
  }, [filters, selectedAmenities, user?.currentLocation, hasAutoFilledLocation]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleOpenInfo = (property) => {
    setSelectedProperty(property);
    setBookingError('');
    setBookingSuccess('');
    setBookingForm({ startDate: '', endDate: '', occupation: '', notes: '' });
    setOpenModal(true);
  };

  const clearSelection = () => {
    setSelectedProperty(null);
    setBookingError('');
    setBookingSuccess('');
    setOpenModal(false);
  };

  const summary = (() => {
    const count = properties.length;
    const rentValues = properties.map((item) => item.rentAmount || 0);
    const averageRent = count ? Math.round(rentValues.reduce((total, value) => total + value, 0) / count) : 0;
    const maxRent = count ? Math.max(...rentValues) : 0;
    return { count, averageRent, maxRent };
  })();

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
        notes: bookingForm.notes,
      },
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
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-7xl items-center justify-between rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <Link to={token && user?.userType === 'renter' ? '/renter' : '/'} className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Home size={20} />
          </div>
          <span className="font-[Poppins] text-xl font-semibold">HouseHunt</span>
        </Link>
        <Link to={token && user?.userType === 'renter' ? '/renter' : '/'} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
          <ArrowLeft size={16} /> Back
        </Link>
      </header>

      <main className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[24px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            <Sparkles size={16} /> Discover homes
          </div>
          <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Find your next ideal home</h1>
          <p className="mt-2 text-sm text-slate-600">Search by your preferred city or use your saved current location to discover nearby homes faster.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <Building2 size={18} className="text-blue-600" />
              <h2 className="font-[Poppins] text-lg font-semibold">Refine search</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
                <input name="location" value={filters.location} onChange={handleFilterChange} placeholder="City or area" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                {user?.currentLocation && (
                  <button type="button" onClick={() => { setFilters((prev) => ({ ...prev, location: user.currentLocation })); setHasAutoFilledLocation(true); }} className="mt-2 text-sm font-semibold text-blue-600">
                    Use my location: {user.currentLocation}
                  </button>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Property type</label>
                <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
                  <option value="All">All types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Studio">Studio</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Furnishing</label>
                <select name="furnishingStatus" value={filters.furnishingStatus} onChange={handleFilterChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
                  <option value="All">Any</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Min price</label>
                  <input name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Max price</label>
                  <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFilterChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Amenities</label>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  {AMENITIES_LIST.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="accent-blue-600" />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="text-3xl font-semibold text-blue-700">{summary.count}</div>
                <div className="mt-2 text-sm text-slate-600">Active listings</div>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="text-3xl font-semibold text-emerald-700">${summary.averageRent}</div>
                <div className="mt-2 text-sm text-slate-600">Average monthly rent</div>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="text-3xl font-semibold text-amber-700">${summary.maxRent}</div>
                <div className="mt-2 text-sm text-slate-600">Highest listing</div>
              </div>
            </div>

            {loading ? (
              <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-10 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">Loading listings…</div>
            ) : error ? (
              <div className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
            ) : (
              <AllPropertiesCards properties={properties} onGetInfo={handleOpenInfo} />
            )}
          </section>
        </div>
      </main>

      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[28px] border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Tour request</div>
                <h3 className="mt-2 font-[Poppins] text-2xl font-semibold">{selectedProperty.title}</h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400"><MapPin size={15} className="text-rose-400" /> {selectedProperty.location}</p>
              </div>
              <button onClick={clearSelection} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">Close</button>
            </div>
            {bookingError && <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">{bookingError}</div>}
            {bookingSuccess && <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">{bookingSuccess}</div>}
            <form onSubmit={handleBookingSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Start date</label>
                <input name="startDate" type="date" required value={bookingForm.startDate} onChange={handleBookingChange} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">End date</label>
                <input name="endDate" type="date" required value={bookingForm.endDate} onChange={handleBookingChange} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">Occupation</label>
                <input name="occupation" required value={bookingForm.occupation} onChange={handleBookingChange} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">Notes</label>
                <textarea name="notes" rows={3} value={bookingForm.notes} onChange={handleBookingChange} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none" />
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-blue-400" /> ${selectedProperty.rentAmount}/mo</span>
                <span className="inline-flex items-center gap-2"><Mail size={15} className="text-violet-400" /> {selectedProperty.owner?.email}</span>
                <span className="inline-flex items-center gap-2"><Phone size={15} className="text-rose-400" /> {selectedProperty.owner?.phone}</span>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={clearSelection} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300">Cancel</button>
                <button type="submit" disabled={bookingLoading} className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
                  {bookingLoading ? 'Submitting...' : 'Submit application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProperties;
