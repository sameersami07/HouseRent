import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import { Building2, Home, LogOut, PlusCircle, ListChecks, CalendarDays, Sparkles } from 'lucide-react';

const OwnerHome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProperties: 0, totalBookings: 0, pendingBookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOwnerStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const propRes = await axios.get('http://localhost:8000/api/owners/properties', config);
        const bookRes = await axios.get('http://localhost:8000/api/owners/bookings', config);

        const props = propRes.data;
        const bookings = bookRes.data;

        setStats({
          totalProperties: props.length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerStats();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <Link to="/owner" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Building2 size={20} />
          </div>
          <span className="font-[Poppins] text-xl font-semibold">HouseHunt</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        {!user?.isApproved && (
          <div className="mb-6 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 shadow-sm">
            <div className="font-semibold">Account verification pending</div>
            <div className="mt-1">Your owner profile still needs admin approval before you can list or manage new properties.</div>
          </div>
        )}

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                <Sparkles size={16} /> Owner dashboard
              </div>
              <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">Track your listings, answer booking requests, and keep your properties performing beautifully.</p>
            </div>
            <Link to="/owner/add-property" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01]">
              <PlusCircle size={18} /> Add new property
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: 'My listings', value: stats.totalProperties, icon: Home },
              { title: 'Total bookings', value: stats.totalBookings, icon: CalendarDays },
              { title: 'Pending action', value: stats.pendingBookings, icon: ListChecks },
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-500">{card.title}</div>
                    <div className="rounded-2xl bg-white p-2 text-blue-600 shadow-sm"><Icon size={16} /></div>
                  </div>
                  <div className="mt-4 font-[Poppins] text-3xl font-semibold text-slate-900">{card.value}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link to="/owner/add-property" className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 text-left transition hover:-translate-y-1">
              <div className="font-semibold text-slate-900">List a property</div>
              <div className="mt-2 text-sm text-slate-600">Share your next rental with a polished listing experience.</div>
            </Link>
            <Link to="/owner/properties" className="rounded-[24px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1">
              <div className="font-semibold text-slate-900">Manage listings</div>
              <div className="mt-2 text-sm text-slate-600">Edit details, toggle availability, and keep your catalog fresh.</div>
            </Link>
            <Link to="/owner/bookings" className="rounded-[24px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1">
              <div className="font-semibold text-slate-900">Booking requests</div>
              <div className="mt-2 text-sm text-slate-600">Approve or decline tenant visits before they become confirmations.</div>
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default OwnerHome;
