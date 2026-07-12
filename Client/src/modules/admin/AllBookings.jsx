import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, Building2, Sparkles } from 'lucide-react';

const AllBookings = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAllBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:8000/api/admin/bookings', config);
        setBookings(res.data);
      } catch (err) {
        setError('Failed to fetch platform bookings history');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [token, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] text-slate-700">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-8 py-6 shadow-xl backdrop-blur">Loading booking history…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-7xl items-center justify-between rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <Link to="/admin" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Building2 size={20} />
          </div>
          <span className="font-[Poppins] text-xl font-semibold">HouseHunt</span>
        </Link>
        <Link to="/admin" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[24px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
            <Sparkles size={16} /> Booking audits
          </div>
          <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Global bookings overview</h1>
          <p className="mt-2 text-sm text-slate-600">Track requests, owners, and renters from one premium view.</p>
        </div>

        {error && <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

        {bookings.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm">
            <h2 className="font-[Poppins] text-xl font-semibold text-slate-900">No bookings yet</h2>
            <p className="mt-2 text-sm text-slate-600">Bookings will appear here as soon as renters start reserving properties.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="font-[Poppins] text-xl font-semibold text-slate-900">{booking.property?.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{booking.property?.location}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-3">
                  <div>
                    <div className="font-semibold text-slate-800">Owner</div>
                    <div>{booking.property?.owner?.name || 'Unknown'}</div>
                    <div className="text-slate-500">{booking.property?.owner?.phone}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Renter</div>
                    <div>{booking.renterDetails?.name}</div>
                    <div className="text-slate-500">Occupation: {booking.renterDetails?.occupation}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Rental period</div>
                    <div>{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllBookings;
