import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { Building2, LogOut, Users, House, CalendarDays, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const AdminHome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAdminStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:8000/api/admin/stats', config);
        setStats(res.data);
      } catch (err) {
        setError('Error fetching admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] text-slate-700">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-8 py-6 shadow-xl backdrop-blur">Loading admin insights…</div>
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
        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-slate-900">System Administrator</div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        {error && <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

        {stats?.pendingOwners > 0 && (
          <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-blue-100 bg-blue-50/80 px-5 py-4 text-sm text-blue-800 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">Pending landlord approvals</div>
              <div className="mt-1">{stats.pendingOwners} new owner accounts need review.</div>
            </div>
            <Link to="/admin/users" className="inline-flex items-center gap-2 font-semibold text-blue-700">Review now <ArrowRight size={16} /></Link>
          </div>
        )}

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
                <Sparkles size={16} /> Admin overview
              </div>
              <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Operational pulse at a glance</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">Monitor platform activity, manage approvals, and stay ahead of growth with a premium admin experience.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Total users', value: stats?.totalUsers, icon: Users, tone: 'from-blue-600 to-cyan-500' },
              { title: 'Properties', value: stats?.totalProperties, icon: House, tone: 'from-violet-600 to-purple-500' },
              { title: 'Bookings', value: stats?.totalBookings, icon: CalendarDays, tone: 'from-emerald-600 to-green-500' },
              { title: 'Verification queue', value: stats?.pendingOwners, icon: ShieldCheck, tone: 'from-rose-500 to-orange-500' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br ${card.tone} p-2 text-white`}>
                    <Icon size={18} />
                  </div>
                  <div className="mt-4 font-[Poppins] text-3xl font-semibold text-slate-900">{card.value ?? 0}</div>
                  <div className="mt-1 text-sm text-slate-500">{card.title}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link to="/admin/users" className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 text-left transition hover:-translate-y-1">
              <div className="font-semibold text-slate-900">Manage user accounts</div>
              <div className="mt-2 text-sm text-slate-600">Review renters, approve owners, and keep your platform secure.</div>
            </Link>
            <Link to="/admin/properties" className="rounded-[24px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1">
              <div className="font-semibold text-slate-900">Oversee listings</div>
              <div className="mt-2 text-sm text-slate-600">Inspect every property and ensure the catalog stays high quality.</div>
            </Link>
            <Link to="/admin/bookings" className="rounded-[24px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1">
              <div className="font-semibold text-slate-900">Review bookings</div>
              <div className="mt-2 text-sm text-slate-600">Track requests, approvals, and platform-wide activity from one hub.</div>
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AdminHome;
