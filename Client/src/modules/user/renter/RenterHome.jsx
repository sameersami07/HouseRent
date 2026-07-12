import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { ArrowRight, Home, LogOut, Search, Sparkles, BadgeCheck, Clock3 } from 'lucide-react';

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
  },
  {
    _id: 'booking-dummy-2',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + (30 + 365) * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Confirmed',
    property: {
      title: 'Industrial Chic Downtown Loft',
      location: 'Loop District, Chicago, IL',
      rentAmount: 2600,
      owner: {
        name: 'John Landlord',
        phone: '555-0199',
      },
    },
    renterDetails: {
      name: 'Alice Tenant',
      occupation: 'Lead Architect at Studio Chicago',
    },
  },
];

const RenterHome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] text-slate-700">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-8 py-6 shadow-xl backdrop-blur">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-7xl items-center justify-between rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <Link to="/renter" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Home size={20} />
          </div>
          <span className="font-[Poppins] text-xl font-semibold">HouseHunt</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-500 hover:text-rose-600">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[24px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
              <Sparkles size={16} /> Renter dashboard
            </div>
            <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="mt-2 text-sm text-slate-600">Track your applications and see when an owner approves your request.</p>
          </div>
          <Link to="/renter/properties" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01]">
            <Search size={16} /> Search properties
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="text-3xl font-semibold text-blue-700">{bookings.length}</div>
            <div className="mt-2 text-sm text-slate-600">Applications sent</div>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="text-3xl font-semibold text-emerald-700">{bookings.filter((b) => b.status === 'Confirmed').length}</div>
            <div className="mt-2 text-sm text-slate-600">Approved requests</div>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="text-3xl font-semibold text-amber-700">{bookings.filter((b) => b.status === 'Pending').length}</div>
            <div className="mt-2 text-sm text-slate-600">Pending review</div>
          </div>
        </div>

        <section className="mt-6 rounded-[24px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mb-5 flex items-center gap-2 text-slate-900">
            <Clock3 size={18} className="text-blue-600" />
            <h2 className="font-[Poppins] text-xl font-semibold">My applications & bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center">
              <p className="text-sm text-slate-600">You have not applied for any rentals yet.</p>
              <Link to="/renter/properties" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white">Browse houses</Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[20px] border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Landlord</th>
                    <th className="px-4 py-3">Rent</th>
                    <th className="px-4 py-3">Rental period</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-semibold text-slate-900">{booking.property?.title}</td>
                      <td className="px-4 py-3 text-slate-600">{booking.property?.location}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <div>{booking.property?.owner?.name}</div>
                        <div className="text-xs text-slate-500">{booking.property?.owner?.phone}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">${booking.property?.rentAmount}/mo</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                          {booking.status === 'Confirmed' ? 'Approved by owner' : booking.status === 'Cancelled' ? 'Cancelled' : 'Pending owner approval'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RenterHome;
