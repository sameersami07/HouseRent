import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import AllPropertiesCards from '../AllPropertiesCards';
import { ArrowLeft, Home, Building2, Sparkles, MapPin, CalendarDays, Phone, Mail, Compass, ExternalLink } from 'lucide-react';

const AMENITIES_LIST = ['WiFi', 'Parking', 'Pool', 'Gym', 'Pet-Friendly', 'Air Conditioning', 'Laundry', 'Furnished Kitchen', 'Balcony'];
const INDIAN_LOCATIONS = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Noida',
  'Gurugram',
  'Surat',
  'Nagpur',
  'Indore',
  'Bhopal',
  'Vadodara',
  'Coimbatore',
  'Mysuru',
  'Kochi',
];

const buildIndiaPropertySeed = (count = 100) => {
  const propertyTypes = ['Apartment', 'House', 'Villa', 'Flat', 'Studio', 'Penthouse'];
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const titlePrefixes = ['Luxury', 'Modern', 'Spacious', 'Premium', 'Serene', 'Bright', 'Comfortable', 'Elegant'];
  const titleSuffixes = ['Residence', 'Apartment', 'Home', 'Villa', 'Flat', 'Tower', 'Suite', 'House'];

  return Array.from({ length: count }, (_, index) => {
    const city = INDIAN_LOCATIONS[index % INDIAN_LOCATIONS.length];
    const propertyType = propertyTypes[index % propertyTypes.length];
    const furnishingStatus = furnishingOptions[index % furnishingOptions.length];
    const rentAmount = 12000 + ((index * 379) % 22000);
    const amenities = AMENITIES_LIST.filter((_, amenityIndex) => (index + amenityIndex) % 3 !== 0).slice(0, 4 + (index % 3));
    const title = `${titlePrefixes[index % titlePrefixes.length]} ${titleSuffixes[index % titleSuffixes.length]} in ${city}`;

    return {
      _id: `india-seed-${index + 1}`,
      title,
      description: `${propertyType} in ${city} with premium interiors, strong connectivity, and ${amenities.slice(0, 3).join(', ')}. Ideal for families, professionals, and students seeking a comfortable stay.`,
      location: `${city}, India`,
      rentAmount,
      propertyType,
      furnishingStatus,
      amenities,
      images: [`https://images.unsplash.com/photo-${['1502672260266-1c1ef2d93688', '1560448204-e02f11c3d0e2', '1494526585095-c41746248156', '1600607687939-ce8a6c25118c', '1460317442991-6f3cb40e6e4a', '1512918728675-ed5a9ecdebfd'][index % 6]}?auto=format&fit=crop&w=900&q=80`],
      status: index % 7 === 0 ? 'Booked' : 'Available',
      owner: {
        name: `Owner ${index + 1}`,
        email: `owner${index + 1}@househunt.in`,
        phone: `+91 98${String(index + 100).padStart(2, '0')} ${String(100000 + index).slice(-6)}`,
        profileImage: `https://images.unsplash.com/photo-${['1500648767791-00dcc994a43e', '1494790108377-be9c29b29330', '1506794778202-cad84cf45f1d', '1544005313-94ddf0286df2'][index % 4]}?auto=format&fit=crop&w=400&q=80`,
      },
    };
  });
};

const DUMMY_PROPERTIES = buildIndiaPropertySeed(100);

const CITY_COORDINATES = {
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.209 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  pune: { lat: 18.5204, lng: 73.8567 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  noida: { lat: 28.5355, lng: 77.391 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  surat: { lat: 21.1702, lng: 72.8311 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  indore: { lat: 22.7196, lng: 75.8577 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  mysuru: { lat: 12.2958, lng: 76.6394 },
  kochi: { lat: 9.9312, lng: 76.2673 },
};

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
  const [geoCoords, setGeoCoords] = useState(null);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [mapQuery, setMapQuery] = useState('');
  const [mapStatus, setMapStatus] = useState('');
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    occupation: '',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const getCityKeyFromText = (value = '') => {
    const normalized = value.toLowerCase().trim();
    if (!normalized) return null;
    return Object.keys(CITY_COORDINATES).find((city) => normalized.includes(city)) || null;
  };

  const getCoordinatesFromLocation = (value = '') => {
    if (!value) return null;

    const trimmed = value.trim();
    const matchedCoords = trimmed.match(/^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/);
    if (matchedCoords) {
      const [lat, lng] = trimmed.split(',').map(Number);
      return { lat, lng };
    }

    const cityKey = getCityKeyFromText(trimmed);
    if (cityKey) return CITY_COORDINATES[cityKey];
    return null;
  };

  const getDistanceKm = (from, to) => {
    if (!from || !to) return Number.POSITIVE_INFINITY;
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(to.lat - from.lat);
    const dLng = toRad(to.lng - from.lng);
    const lat1 = toRad(from.lat);
    const lat2 = toRad(to.lat);
    const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const isValidObjectId = (value) => {
    if (!value) return false;
    return /^[0-9a-fA-F]{24}$/.test(String(value));
  };

  const sortPropertiesByProximity = (list, locationOverride = filters.location || user?.currentLocation || '') => {
    const targetCoords = geoCoords || getCoordinatesFromLocation(locationOverride);
    if (!targetCoords) return list;

    return [...list].sort((left, right) => {
      const leftCity = getCityKeyFromText(left.location || '');
      const rightCity = getCityKeyFromText(right.location || '');
      const leftCoords = leftCity ? CITY_COORDINATES[leftCity] : null;
      const rightCoords = rightCity ? CITY_COORDINATES[rightCity] : null;
      const leftDistance = leftCoords ? getDistanceKm(targetCoords, leftCoords) : Number.POSITIVE_INFINITY;
      const rightDistance = rightCoords ? getDistanceKm(targetCoords, rightCoords) : Number.POSITIVE_INFINITY;

      if (leftDistance === rightDistance) {
        return (left.rentAmount || 0) - (right.rentAmount || 0);
      }
      return leftDistance - rightDistance;
    });
  };

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
      const sourceProperties = res.data && res.data.length > 0 ? res.data : filterDummyProperties(DUMMY_PROPERTIES);
      setProperties(sortPropertiesByProximity(sourceProperties));
    } catch (err) {
      setProperties(sortPropertiesByProximity(filterDummyProperties(DUMMY_PROPERTIES)));
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
    setMapQuery(property?.location || '');
    setMapStatus('');
    setOpenModal(true);
  };

  const clearSelection = () => {
    setSelectedProperty(null);
    setBookingError('');
    setBookingSuccess('');
    setMapQuery('');
    setMapStatus('');
    setOpenModal(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapStatus('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        const parsedCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setGeoCoords(parsedCoords);
        setMapQuery(coords);
        setMapStatus('Showing your current location and prioritizing nearby homes.');
      },
      () => {
        setMapStatus('Unable to access your location. Please search by city or area instead.');
      }
    );
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

    if (!selectedProperty || !isValidObjectId(selectedProperty._id)) {
      setBookingError('This preview listing cannot receive bookings yet. Please choose a real property from the backend to submit an application.');
      setBookingLoading(false);
      return;
    }

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

      setBookingSuccess('Booking application submitted successfully. The owner will review and approve it shortly.');
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
                <p className="mt-2 text-xs text-slate-500">Search from over 100 Indian homes across major cities and suburbs.</p>
                {user?.currentLocation && (
                  <button type="button" onClick={() => { setFilters((prev) => ({ ...prev, location: user.currentLocation })); setHasAutoFilledLocation(true); }} className="mt-2 text-sm font-semibold text-blue-600">
                    Use my location: {user.currentLocation}
                  </button>
                )}
                <button type="button" onClick={handleUseCurrentLocation} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-violet-600">
                  <Compass size={14} /> Use live GPS map
                </button>
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

            <div className="mb-4 rounded-[20px] border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {filters.location || user?.currentLocation || geoCoords
                ? `Sorted by proximity to ${filters.location || user?.currentLocation || 'your current location'}.`
                : 'Search by city or use your location to sort nearby homes first.'}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {INDIAN_LOCATIONS.slice(0, 8).map((city) => (
                <button key={city} type="button" onClick={() => setFilters((prev) => ({ ...prev, location: city }))} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-600">
                  {city}
                </button>
              ))}
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
            {!isValidObjectId(selectedProperty?._id) && (
              <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
                This home is part of the preview catalog. Booking requests are available only for properties stored in the live backend database.
              </div>
            )}
            <form onSubmit={handleBookingSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Start date</label>
                <input name="startDate" type="date" required value={bookingForm.startDate} onChange={handleBookingChange} disabled={!isValidObjectId(selectedProperty?._id)} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none disabled:cursor-not-allowed disabled:opacity-60" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">End date</label>
                <input name="endDate" type="date" required value={bookingForm.endDate} onChange={handleBookingChange} disabled={!isValidObjectId(selectedProperty?._id)} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none disabled:cursor-not-allowed disabled:opacity-60" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">Occupation</label>
                <input name="occupation" required value={bookingForm.occupation} onChange={handleBookingChange} disabled={!isValidObjectId(selectedProperty?._id)} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none disabled:cursor-not-allowed disabled:opacity-60" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">Notes</label>
                <textarea name="notes" rows={3} value={bookingForm.notes} onChange={handleBookingChange} disabled={!isValidObjectId(selectedProperty?._id)} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none disabled:cursor-not-allowed disabled:opacity-60" />
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-blue-400" /> ${selectedProperty.rentAmount}/mo</span>
                <span className="inline-flex items-center gap-2"><Mail size={15} className="text-violet-400" /> {selectedProperty.owner?.email}</span>
                <span className="inline-flex items-center gap-2"><Phone size={15} className="text-rose-400" /> {selectedProperty.owner?.phone}</span>
              </div>
              <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <MapPin size={16} className="text-rose-400" /> Google map preview
                  </div>
                  <a href={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery || selectedProperty.location)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400">
                    Open in Google Maps <ExternalLink size={14} />
                  </a>
                </div>
                {mapStatus && <p className="mt-2 text-sm text-slate-400">{mapStatus}</p>}
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800">
                  <iframe
                    title="property-google-map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery || selectedProperty.location)}&output=embed`}
                    className="h-64 w-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={clearSelection} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300">Cancel</button>
                <button type="submit" disabled={bookingLoading || !isValidObjectId(selectedProperty?._id)} className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
                  {bookingLoading ? 'Submitting...' : !isValidObjectId(selectedProperty?._id) ? 'Preview only' : 'Submit application'}
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
