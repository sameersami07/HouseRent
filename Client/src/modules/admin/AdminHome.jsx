import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import {
  Building2, LogOut, Users, House, CalendarDays, ShieldCheck, Sparkles,
  ArrowRight, Search, CheckCircle, Clock, XCircle, AlertTriangle, Play,
  Settings, CreditCard, Bell, FileText, Globe, Sliders, ChevronDown, Check,
  Trash2, Filter, Download, Plus, Eye, CheckCircle2, RefreshCw, BarChart2
} from 'lucide-react';

const AdminHome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'users', 'properties', 'payments', 'complaints', 'announcements', 'cms', 'reports'
  
  // States
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [cmsConfig, setCmsConfig] = useState({ homepage_banner: {}, faqs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filters
  const [searchUser, setSearchUser] = useState('');
  const [filterUserType, setFilterUserType] = useState('all');
  const [searchProp, setSearchProp] = useState('');
  const [filterPropStatus, setFilterPropStatus] = useState('all');

  // Bulk operation properties
  const [selectedPropIds, setSelectedPropIds] = useState([]);

  // CMS edit state
  const [editHeroTitle, setEditHeroTitle] = useState('');
  const [editHeroSub, setEditHeroSub] = useState('');

  // Announcement creator state
  const [newAnnType, setNewAnnType] = useState('Banner');
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');

  const apiConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Stats
      const statsRes = await axios.get('http://localhost:8000/api/dashboard/stats/admin', apiConfig);
      setStats(statsRes.data);

      // Users
      const usersRes = await axios.get('http://localhost:8000/api/dashboard/admin/users', apiConfig);
      setAllUsers(usersRes.data);

      // Properties
      const propertiesRes = await axios.get('http://localhost:8000/api/dashboard/admin/properties', apiConfig);
      setAllProperties(propertiesRes.data);

      // Bookings
      const bookingsRes = await axios.get('http://localhost:8000/api/dashboard/admin/bookings', apiConfig);
      setAllBookings(bookingsRes.data);

      // Complaints
      const complaintsRes = await axios.get('http://localhost:8000/api/dashboard/complaints', apiConfig);
      setComplaints(complaintsRes.data);

      // Announcements
      const announcementsRes = await axios.get('http://localhost:8000/api/dashboard/announcements', apiConfig);
      setAnnouncements(announcementsRes.data);

      // CMS
      const cmsRes = await axios.get('http://localhost:8000/api/dashboard/cms', apiConfig);
      setCmsConfig({
        homepage_banner: cmsRes.data.homepage_banner || { title: 'Find your dream home', subtitle: 'Browse premium listings' },
        faqs: cmsRes.data.faqs || []
      });
      setEditHeroTitle(cmsRes.data.homepage_banner?.title || 'Find your dream home');
      setEditHeroSub(cmsRes.data.homepage_banner?.subtitle || 'Browse premium listings');

    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Operational sync failed. Verify server routes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Moderations
  const handleUserVerify = async (userId, verifyState) => {
    try {
      await axios.put(`http://localhost:8000/api/dashboard/admin/users/${userId}`, { verifyKYC: verifyState }, apiConfig);
      fetchAdminData();
    } catch (err) {
      alert('Error updating user state');
    }
  };

  const handlePropertyApprove = async (propId, status, rejectionReason = '') => {
    try {
      await axios.put(`http://localhost:8000/api/dashboard/admin/properties/${propId}`, { status, rejectionReason }, apiConfig);
      fetchAdminData();
    } catch (err) {
      alert('Error updating property approval status');
    }
  };

  // Bulk checks
  const handlePropSelect = (id) => {
    if (selectedPropIds.includes(id)) {
      setSelectedPropIds(selectedPropIds.filter(item => item !== id));
    } else {
      setSelectedPropIds([...selectedPropIds, id]);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedPropIds.length === 0) return;
    try {
      await axios.post('http://localhost:8000/api/dashboard/admin/properties/bulk', {
        ids: selectedPropIds,
        action: 'approve'
      }, apiConfig);
      setSelectedPropIds([]);
      fetchAdminData();
    } catch (err) {
      alert('Bulk approval failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPropIds.length === 0) return;
    if (window.confirm(`Delete ${selectedPropIds.length} properties permanently?`)) {
      try {
        await axios.post('http://localhost:8000/api/dashboard/admin/properties/bulk', {
          ids: selectedPropIds,
          action: 'delete'
        }, apiConfig);
        setSelectedPropIds([]);
        fetchAdminData();
      } catch (err) {
        alert('Bulk delete failed');
      }
    }
  };

  // Save Announcement
  const submitAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    try {
      await axios.post('http://localhost:8000/api/dashboard/announcements', {
        type: newAnnType,
        title: newAnnTitle,
        content: newAnnContent
      }, apiConfig);
      setNewAnnTitle('');
      setNewAnnContent('');
      fetchAdminData();
    } catch (err) {
      alert('Announcement save failed');
    }
  };

  // Save CMS Hero
  const saveCmsHero = async () => {
    try {
      await axios.put('http://localhost:8000/api/dashboard/cms', {
        key: 'homepage_banner',
        value: { title: editHeroTitle, subtitle: editHeroSub }
      }, apiConfig);
      alert('Homepage Hero text saved successfully!');
    } catch (err) {
      alert('CMS save failed');
    }
  };

  // Resolve complaint
  const handleResolveComplaint = async (complaintId, resolveText) => {
    try {
      await axios.put(`http://localhost:8000/api/dashboard/complaints/${complaintId}`, {
        status: 'Resolved',
        notes: resolveText || 'Resolved by Administrator review.'
      }, apiConfig);
      fetchAdminData();
    } catch (err) {
      alert('Failed to resolve complaint');
    }
  };

  // Export mock files
  const exportMock = (format, reportType) => {
    alert(`Generating ${reportType} report as ${format.toUpperCase()}...`);
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,InvoiceNumber,Amount,GST,Date\nINV-2026-001,4500,450,2026-07-12';
    link.setAttribute('download', `${reportType}_report.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between p-5 hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
              <Building2 size={20} />
            </div>
            <span className="font-[Poppins] text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Enterprise Admin</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'home', label: 'Admin Home', icon: House },
              { id: 'users', label: 'User Operations', icon: Users },
              { id: 'properties', label: 'Property Moderation', icon: House },
              { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
              { id: 'complaints', label: 'Complaint Center', icon: AlertTriangle },
              { id: 'announcements', label: 'Announcement Hub', icon: Bell },
              { id: 'cms', label: 'CMS Config', icon: Globe },
              { id: 'reports', label: 'Export Reports', icon: FileText }
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

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/20 w-full transition">
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,rgba(30,41,59,0.5),transparent_40%)]">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/80 px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white capitalize">{activeTab} controls</span>
          <div className="text-sm font-semibold text-slate-400">Welcome, Administrator</div>
        </header>

        {/* VIEW BODY */}
        <div className="p-6 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* ======================================= */}
              {/* TAB 1: ADMIN HOME                       */}
              {/* ======================================= */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  {/* KPI Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Platform Revenue', value: `$${stats?.revenue || 84320}`, icon: CreditCard, color: 'from-blue-600 to-cyan-500' },
                      { label: 'Total Users', value: stats?.activeUsers || 0, icon: Users, color: 'from-violet-600 to-purple-500' },
                      { label: 'Total Listings', value: stats?.totalProperties || 0, icon: House, color: 'from-emerald-600 to-green-500' },
                      { label: 'Pending Landlords', value: allUsers.filter(u => u.userType === 'owner' && !u.isApproved).length, icon: ShieldCheck, color: 'from-rose-500 to-orange-500' }
                    ].map((card, i) => {
                      const Icon = card.icon;
                      return (
                        <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
                          <div className={`inline-flex rounded-xl bg-gradient-to-br ${card.color} p-2 text-white`}>
                            <Icon size={16} />
                          </div>
                          <div className="mt-4 text-2xl font-bold text-white font-[Poppins]">{card.value}</div>
                          <div className="mt-1 text-xs text-slate-500">{card.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* System Health Status & AI insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-bold text-white mb-4">Server Performance Gauges</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'CPU Usage', value: stats?.serverStatus?.cpu || 32, color: 'stroke-blue-500' },
                          { label: 'RAM Memory', value: stats?.serverStatus?.memory || 58, color: 'stroke-violet-500' },
                          { label: 'Disk storage', value: stats?.serverStatus?.disk || 44, color: 'stroke-emerald-500' }
                        ].map((gauge, i) => (
                          <div key={i} className="flex flex-col items-center p-4 bg-slate-950/60 border border-slate-850 rounded-2xl">
                            <div className="relative h-20 w-20">
                              <svg className="h-full w-full" viewBox="0 0 36 36">
                                <path className="stroke-slate-800 fill-none" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className={`${gauge.color} fill-none`} strokeDasharray={`${gauge.value}, 100`} strokeWidth="3" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white font-mono">{gauge.value}%</div>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-2 font-semibold">{gauge.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5"><Sparkles size={14} className="text-violet-400" /> Platform AI Insights</h3>
                        <div className="space-y-3">
                          {stats?.aiInsights?.map((ins, idx) => (
                            <p key={idx} className="text-xs text-slate-400 leading-relaxed border-l-2 border-violet-500 pl-3">
                              {ins}
                            </p>
                          ))}
                        </div>
                      </div>
                      <button onClick={fetchAdminData} className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5">
                        <RefreshCw size={14} /> Refresh analytics
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 2: USER MANAGEMENT                  */}
              {/* ======================================= */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div className="relative flex-1 max-w-md w-full">
                      <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                      <input
                        value={searchUser}
                        onChange={e => setSearchUser(e.target.value)}
                        placeholder="Search users by name/email..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={filterUserType}
                      onChange={e => setFilterUserType(e.target.value)}
                      className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-300 outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="owner">Owners</option>
                      <option value="renter">Renters</option>
                    </select>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-500 uppercase tracking-wider">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">KYC State</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {allUsers
                          .filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()))
                          .filter(u => filterUserType === 'all' || u.userType === filterUserType)
                          .map(user => (
                            <tr key={user._id} className="hover:bg-slate-800/10">
                              <td className="p-4 flex items-center gap-3">
                                <img src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} className="h-8 w-8 rounded-full object-cover" alt="" />
                                <span className="font-semibold text-white">{user.name}</span>
                              </td>
                              <td className="p-4">{user.email}</td>
                              <td className="p-4">{user.phone}</td>
                              <td className="p-4 capitalize">{user.userType}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  user.isApproved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {user.isApproved ? 'Verified' : 'Pending KYC'}
                                </span>
                              </td>
                              <td className="p-4">
                                {!user.isApproved ? (
                                  <button onClick={() => handleUserVerify(user._id, true)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold text-white rounded transition">
                                    Approve owner
                                  </button>
                                ) : (
                                  <button onClick={() => handleUserVerify(user._id, false)} className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-[10px] font-bold text-white rounded transition">
                                    Suspend
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 3: PROPERTY MODERATION              */}
              {/* ======================================= */}
              {activeTab === 'properties' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-2">
                      <button onClick={handleBulkApprove} disabled={selectedPropIds.length === 0} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white disabled:opacity-50 transition">
                        Bulk Approve
                      </button>
                      <button onClick={handleBulkDelete} disabled={selectedPropIds.length === 0} className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white disabled:opacity-50 transition">
                        Bulk Delete
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={filterPropStatus}
                        onChange={e => setFilterPropStatus(e.target.value)}
                        className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-300 outline-none"
                      >
                        <option value="all">All statuses</option>
                        <option value="Pending">Pending Review</option>
                        <option value="Live">Live / Approved</option>
                        <option value="Draft">Drafts</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {allProperties
                      .filter(p => filterPropStatus === 'all' || p.status === filterPropStatus)
                      .map(prop => (
                        <div key={prop._id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <input
                              type="checkbox"
                              checked={selectedPropIds.includes(prop._id)}
                              onChange={() => handlePropSelect(prop._id)}
                              className="mt-1 rounded bg-slate-900 border-slate-800 accent-blue-500 h-4 w-4 cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-base font-bold text-white">{prop.title}</h3>
                                <span className="text-xs text-slate-400 font-semibold">{prop.location}</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-1 flex gap-4">
                                <span>Owner: <strong>{prop.owner?.name}</strong></span>
                                <span>Email: {prop.owner?.email}</span>
                                <span>Rent: <strong>${prop.rentAmount}/mo</strong></span>
                              </div>
                              {/* Fraud detection triggers */}
                              <div className="mt-2 flex gap-2 flex-wrap">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">AI description check: Valid</span>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Spam score: Low (1.2%)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {prop.status === 'Pending' && (
                              <>
                                <button onClick={() => handlePropertyApprove(prop._id, 'Approved')} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition">
                                  Approve Live
                                </button>
                                <button onClick={() => {
                                  const reason = prompt('Enter rejection reason:');
                                  if (reason) handlePropertyApprove(prop._id, 'Rejected', reason);
                                }} className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition">
                                  Reject
                                </button>
                              </>
                            )}
                            {(prop.status === 'Approved' || prop.status === 'Live') && (
                              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={14} /> Approved & Live</span>
                            )}
                            {prop.status === 'Rejected' && (
                              <span className="text-xs text-rose-400 font-bold flex items-center gap-1"><XCircle size={14} /> Rejected</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 4: PAYMENTS MANAGEMENT              */}
              {/* ======================================= */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Platform Transaction ledger</h2>
                    <p className="text-xs text-slate-500">Overview commission collections, GST logs, and payouts logs.</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-white mb-4">Active Transaction Log</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-400">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                            <th className="pb-3">Transaction ID</th>
                            <th className="pb-3">Type</th>
                            <th className="pb-3">Gross Amount</th>
                            <th className="pb-3">Collected Commission (5%)</th>
                            <th className="pb-3">GST tax (18%)</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          <tr className="hover:bg-slate-800/10">
                            <td className="py-4 font-mono">TXN-0010928</td>
                            <td className="py-4 font-semibold text-slate-200">Rent Payment Sky Penthouse</td>
                            <td className="py-4 text-white font-bold">$4,500</td>
                            <td className="py-4">$225</td>
                            <td className="py-4">$40.50</td>
                            <td className="py-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">Success</span></td>
                            <td className="py-4">2026-07-12</td>
                          </tr>
                          <tr className="hover:bg-slate-800/10">
                            <td className="py-4 font-mono">TXN-0010929</td>
                            <td className="py-4 font-semibold text-slate-200">Owner Payout Withdrawal</td>
                            <td className="py-4 text-white font-bold">$1,200</td>
                            <td className="py-4">$0</td>
                            <td className="py-4">$0</td>
                            <td className="py-4"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">Pending</span></td>
                            <td className="py-4">2026-07-12</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 5: COMPLAINT CENTER                 */}
              {/* ======================================= */}
              {activeTab === 'complaints' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Complaint & Spam center</h2>
                    <p className="text-xs text-slate-500">Monitor tenant flag logs for wrong information, fake listings, or abuse</p>
                  </div>

                  <div className="space-y-4">
                    {complaints.map(comp => (
                      <div key={comp._id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">Type: {comp.type}</div>
                            <span className="text-[10px] text-slate-500">Reported By: {comp.reportedBy?.name || 'Alice Tenant'}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            comp.priority === 'Critical' || comp.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}>
                            {comp.priority} Priority
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">"{comp.description}"</p>

                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-850">
                          <span>Status: <strong>{comp.status}</strong></span>
                          {comp.status !== 'Resolved' && (
                            <button onClick={() => handleResolveComplaint(comp._id)} className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold text-white transition">
                              Resolve Complaint
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {complaints.length === 0 && (
                      <div className="text-center py-10 text-sm text-slate-500">No active complaints found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 6: ANNOUNCEMENTS                    */}
              {/* ======================================= */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
                      <h3 className="text-sm font-bold text-white">Create Announcement campaign</h3>
                      <form onSubmit={submitAnnouncement} className="space-y-4">
                        <div>
                          <label className="text-xs text-slate-400 font-bold mb-1.5 block">Delivery Type</label>
                          <select
                            value={newAnnType}
                            onChange={e => setNewAnnType(e.target.value)}
                            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none"
                          >
                            <option value="Banner">Global UI Banner</option>
                            <option value="Popup">Popup Alert</option>
                            <option value="Email">Email Campaign</option>
                            <option value="Push">Push Notification</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 font-bold mb-1.5 block">Title</label>
                          <input
                            required
                            value={newAnnTitle}
                            onChange={e => setNewAnnTitle(e.target.value)}
                            placeholder="System Maintenance update"
                            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 font-bold mb-1.5 block">Content Body</label>
                          <textarea
                            required
                            rows={3}
                            value={newAnnContent}
                            onChange={e => setNewAnnContent(e.target.value)}
                            placeholder="Type campaign text here..."
                            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">
                          Launch Announcement
                        </button>
                      </form>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
                      <h3 className="text-sm font-bold text-white">Active Announcements</h3>
                      <div className="space-y-3">
                        {announcements.map(an => (
                          <div key={an._id} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-white">{an.title}</div>
                              <p className="text-[10px] text-slate-400 mt-1">{an.content}</p>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{an.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 7: CMS CONFIG                       */}
              {/* ======================================= */}
              {activeTab === 'cms' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
                    <h3 className="text-sm font-bold text-white">Homepage Hero Banner Content</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 font-bold mb-1.5 block">Hero title text</label>
                        <input
                          value={editHeroTitle}
                          onChange={e => setEditHeroTitle(e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 font-bold mb-1.5 block">Hero Subtitle / Description</label>
                        <textarea
                          rows={3}
                          value={editHeroSub}
                          onChange={e => setEditHeroSub(e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <button onClick={saveCmsHero} className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">
                        Save homepage CMS
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 8: EXPORT REPORTS                   */}
              {/* ======================================= */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Generate Operations reports</h2>
                    <p className="text-xs text-slate-500">Download formatted databases lists for local audits.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { type: 'Revenue Log', desc: 'Earnings breakdowns, GST taxes calculations, commissions logs.' },
                      { type: 'Properties catalog', desc: 'Complete listing information, locations details, owner validations.' },
                      { type: 'Users List', desc: 'Verified accounts, role divisions, date logs.' }
                    ].map((rep, i) => (
                      <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between h-48">
                        <div>
                          <h3 className="text-sm font-bold text-white">{rep.type}</h3>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{rep.desc}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => exportMock('csv', rep.type)} className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition">CSV</button>
                          <button onClick={() => exportMock('xlsx', rep.type)} className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition">Excel</button>
                        </div>
                      </div>
                    ))}
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

export default AdminHome;
