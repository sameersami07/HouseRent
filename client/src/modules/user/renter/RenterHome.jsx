import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import {
  ArrowRight, Home, LogOut, Search, Sparkles, BadgeCheck, Clock3,
  Calculator, Heart, MapPin, ShieldAlert, Star, RefreshCw, Layers, Check, X
} from 'lucide-react';

const DUMMY_BOOKINGS = [
  {
    _id: 'booking-dummy-1',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + (14 + 180) * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    property: {
      title: 'Cozy Brooklyn Studio Apartment',
      location: 'Williamsburg, Brooklyn, NY',
      rentAmount: 1850,
      owner: {
        name: 'John Landlord',
        phone: '555-0199',
      },
    },
    renterDetails: {
      name: 'Alice Tenant',
      occupation: 'Graduate Researcher at Chicago Uni',
    },
  }
];

const RenterHome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'compare', 'calculators', 'favorites', 'neighborhood'
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Financial Calculators state
  const [calcHomePrice, setCalcHomePrice] = useState(300000);
  const [calcDownPayment, setCalcDownPayment] = useState(60000);
  const [calcInterestRate, setCalcInterestRate] = useState(4.5);
  const [calcTermYears, setCalcTermYears] = useState(30);
  const [emiResult, setEmiResult] = useState(0);

  // Property comparison checklist state
  const [compareProps, setCompareProps] = useState([
    { id: 1, title: 'Luxury Villa Chicago', price: 4500, type: 'Villa', beds: 4, baths: 3, walkScore: 82, aqi: 45, crime: 'Low' },
    { id: 2, title: 'Downtown Chic Loft', price: 2600, type: 'Apartment', beds: 2, baths: 1.5, walkScore: 94, aqi: 60, crime: 'Medium' }
  ]);

  // Neighborhood metrics search state
  const [selectedCity, setSelectedCity] = useState('Chicago');
  const [crimeRating, setCrimeRating] = useState('Low');
  const [aqiScore, setAqiScore] = useState(42);
  const [walkScore, setWalkScore] = useState(88);

  const fetchBookings = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8000/api/users/bookings', config);
      if (res.data && res.data.length > 0) {
        setBookings(res.data);
      } else {
        setBookings(DUMMY_BOOKINGS);
      }
    } catch (err) {
      setBookings(DUMMY_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [token, navigate]);

  // Run EMI calculations
  useEffect(() => {
    const principal = calcHomePrice - calcDownPayment;
    const monthlyInterest = (calcInterestRate / 100) / 12;
    const totalPayments = calcTermYears * 12;
    
    if (monthlyInterest === 0) {
      setEmiResult((principal / totalPayments).toFixed(2));
      return;
    }

    const emi = (principal * monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) / 
                (Math.pow(1 + monthlyInterest, totalPayments) - 1);
    
    setEmiResult(emi.toFixed(2));
  }, [calcHomePrice, calcDownPayment, calcInterestRate, calcTermYears]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between p-5 hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
              <Home size={20} />
            </div>
            <span className="font-[Poppins] text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Renter Hub</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard Home', icon: Home },
              { id: 'compare', label: 'Compare Listings', icon: Layers },
              { id: 'calculators', label: 'EMI Calculators', icon: Calculator },
              { id: 'favorites', label: 'Favorites Center', icon: Heart },
              { id: 'neighborhood', label: 'Neighborhood Info', icon: MapPin }
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 text-blue-400' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 w-full">
          {user?.userType === 'admin' && (
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-blue-400 hover:bg-blue-950/20 transition w-full">
              <Home size={18} />
              Admin Dashboard
            </Link>
          )}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/20 transition w-full">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* CONTAINER */}
      <main className="flex-1 min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,rgba(30,41,59,0.5),transparent_40%)]">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/80 px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white capitalize">{activeTab} Overview</span>
          <div className="flex items-center gap-3">
            {user?.userType === 'admin' && (
              <Link to="/admin/add-property" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:scale-[1.02]">
                Add New Property
              </Link>
            )}
            <Link to="/renter/properties" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:scale-[1.02]">
              <Search size={14} /> Search catalog
            </Link>
          </div>
        </header>


        <div className="p-6 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/30 via-violet-950/20 to-slate-950 p-6">
                    <h2 className="text-2xl font-[Poppins] font-bold text-white">Welcome back, {user?.name.split(' ')[0]}!</h2>
                    <p className="text-xs text-slate-400 mt-1">Audit status of applications and schedules.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Visits requested', value: bookings.length, color: 'text-blue-400' },
                      { label: 'Confirmed visits', value: bookings.filter(b => b.status === 'Confirmed').length, color: 'text-emerald-400' },
                      { label: 'Pending answers', value: bookings.filter(b => b.status === 'Pending').length, color: 'text-amber-400' }
                    ].map((stat, i) => (
                      <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
                        <div className="text-xs font-semibold text-slate-400">{stat.label}</div>
                        <div className={`mt-2 text-2xl font-bold ${stat.color} font-[Poppins]`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-4">My Application & visit checklist</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-400">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                            <th className="pb-3">Property</th>
                            <th className="pb-3">Location</th>
                            <th className="pb-3">Rent</th>
                            <th className="pb-3">Landlord</th>
                            <th className="pb-3">Status</th>
                            {user?.userType === 'admin' && <th className="pb-3 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {bookings.map(b => (
                            <tr key={b._id} className="hover:bg-slate-800/10">
                              <td className="py-4 font-semibold text-slate-200">{b.property?.title}</td>
                              <td className="py-4">{b.property?.location}</td>
                              <td className="py-4 text-emerald-400 font-bold">${b.property?.rentAmount}/mo</td>
                              <td className="py-4">{b.property?.owner?.name || 'John Landlord'}</td>
                              <td className="py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                  b.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              {user?.userType === 'admin' && (
                                <td className="py-4 text-right">
                                  {b.status === 'Pending' ? (
                                    <button
                                      onClick={async () => {
                                        if (window.confirm('Accept this booking and process the rent payment?')) {
                                          try {
                                            const config = { headers: { Authorization: `Bearer ${token}` } };
                                            await axios.put(`http://localhost:8000/api/admin/bookings/${b._id}/accept`, {}, config);
                                            alert('Booking and payment accepted successfully!');
                                            fetchBookings();
                                          } catch (err) {
                                            alert(err.response?.data?.message || 'Failed to accept booking');
                                          }
                                        }
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-650 hover:bg-emerald-700 text-[10px] font-bold text-white transition whitespace-nowrap"
                                    >
                                      Accept & Pay
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-500">N/A</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMPARE PROPERTIES */}
              {activeTab === 'compare' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Compare Listings Side-by-Side</h2>
                    <p className="text-xs text-slate-500">Analyze prices, crime ratings, walk scores, and layout metrics side-by-side.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {compareProps.map(item => (
                      <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-white">{item.title}</h3>
                          <span className="text-xs font-bold text-emerald-400">${item.price}/mo</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                          <div className="bg-slate-950/60 p-2.5 rounded-lg">Beds: <strong>{item.beds}</strong></div>
                          <div className="bg-slate-950/60 p-2.5 rounded-lg">Type: <strong>{item.type}</strong></div>
                          <div className="bg-slate-950/60 p-2.5 rounded-lg">Walk Score: <strong>{item.walkScore}/100</strong></div>
                          <div className="bg-slate-950/60 p-2.5 rounded-lg">AQI Index: <strong>{item.aqi} (Good)</strong></div>
                          <div className="bg-slate-950/60 p-2.5 rounded-lg col-span-2">Crime rating: <strong>{item.crime}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EMI CALCULATORS */}
              {activeTab === 'calculators' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Mortgage & Rent Yield Calculator</h2>
                    <p className="text-xs text-slate-500">Estimate monthly finance costs and project homeownership returns.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
                      <h3 className="text-sm font-bold text-white">Mortgage Parameters</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Property Purchase Price ($)</label>
                          <input type="number" value={calcHomePrice} onChange={e => setCalcHomePrice(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Down Payment ($)</label>
                          <input type="number" value={calcDownPayment} onChange={e => setCalcDownPayment(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Interest Rate (%)</label>
                          <input type="number" step="0.1" value={calcInterestRate} onChange={e => setCalcInterestRate(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-2">Estimated Monthly Mortgage Payment (EMI)</h3>
                        <div className="text-4xl font-bold text-blue-400 font-[Poppins]">${emiResult}/mo</div>
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed pt-4 border-t border-slate-800">
                        Based on a {calcTermYears}-year fixed term mortgage with a ${calcHomePrice - calcDownPayment} principal loan amount.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FAVORITES */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Favorite Locations & Verified Owners</h2>
                    <p className="text-xs text-slate-500">Fast tracking folders of listings matching specific geographic sectors.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-rose-500" size={18} />
                        <div>
                          <div className="text-xs font-bold text-white">Loop District, Chicago, IL</div>
                          <span className="text-[10px] text-slate-500">2 active saved alerts</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Heart className="text-rose-500 fill-current" size={18} />
                        <div>
                          <div className="text-xs font-bold text-white">John Landlord (Verified)</div>
                          <span className="text-[10px] text-slate-500">Rating: 4.9/5 stars</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: NEIGHBORHOOD */}
              {activeTab === 'neighborhood' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Neighborhood suitability metrics</h2>
                    <p className="text-xs text-slate-500">Review real-time crime indexes, air quality scores, and transit walkability values.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
                      <div className="text-slate-400 text-xs font-bold">Walk Score index</div>
                      <div className="text-3xl font-bold text-blue-400 font-[Poppins]">{walkScore}/100</div>
                      <span className="text-[10px] text-slate-500 block">Extremely pedestrian friendly</span>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
                      <div className="text-slate-400 text-xs font-bold">Air Quality Index (AQI)</div>
                      <div className="text-3xl font-bold text-emerald-400 font-[Poppins]">{aqiScore}</div>
                      <span className="text-[10px] text-slate-500 block">Clean / healthy climate</span>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
                      <div className="text-slate-400 text-xs font-bold">Crime Safety rating</div>
                      <div className="text-3xl font-bold text-amber-400 font-[Poppins]">{crimeRating}</div>
                      <span className="text-[10px] text-slate-500 block">Low risk incident index</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default RenterHome;
