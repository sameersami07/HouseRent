import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { ArrowLeft, Building2, Sparkles, MapPin, ExternalLink } from 'lucide-react';

const AllBookings = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8000/api/owners/bookings', config);
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch booking requests');
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

  const handleUpdateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8000/api/owners/bookings/${id}`, { status }, config);
      fetchBookings();
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] text-slate-700">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-8 py-6 shadow-xl backdrop-blur">Loading booking requests…</div>
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
        <div className="mb-6 rounded-[24px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
            <Sparkles size={16} /> Booking requests
          </div>
          <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Tenant booking requests</h1>
          <p className="mt-2 text-sm text-slate-600">Approve, decline, or pause renter requests while keeping your listings organized.</p>
        </div>

        {error && <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

        {bookings.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm">
            <h2 className="font-[Poppins] text-xl font-semibold text-slate-900">No requests yet</h2>
            <p className="mt-2 text-sm text-slate-600">You will see all renter booking requests in this premium inbox.</p>
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
                <div className="mt-4 grid gap-4 text-sm text-slate-600 lg:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <div className="font-semibold text-slate-800">Renter</div>
                    <div>{booking.renterDetails?.name}</div>
                    <div className="text-slate-500">{booking.renterDetails?.occupation || 'Not specified'}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Contact</div>
                    <div>{booking.renterDetails?.email}</div>
                    <div>{booking.renterDetails?.phone}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Dates</div>
                    <div>{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</div>
                  </div>
                </div>
                {booking.renterDetails?.notes && <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">Note: {booking.renterDetails.notes}</div>}
                <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <MapPin size={16} className="text-rose-500" /> Property location
                    </div>
                    <a href={`https://www.google.com/maps?q=${encodeURIComponent(booking.property?.location || '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                      Open map <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <iframe
                      title={`booking-map-${booking._id}`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(booking.property?.location || '')}&output=embed`}
                      className="h-48 w-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">Renter request status: {booking.status === 'Pending' ? 'Awaiting your approval' : booking.status === 'Confirmed' ? 'Approved for the renter' : 'Rejected for the renter'}</div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {booking.status === 'Pending' ? (
                    <>
                      <button onClick={() => handleUpdateStatus(booking._id, 'Confirmed')} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">Approve</button>
                      <button onClick={() => handleUpdateStatus(booking._id, 'Cancelled')} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50">Reject</button>
                    </>
                  ) : (
                    <button onClick={() => handleUpdateStatus(booking._id, 'Pending')} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">Reset to pending</button>
                  )}
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
