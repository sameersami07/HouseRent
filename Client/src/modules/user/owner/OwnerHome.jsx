import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import {
  Home, Building2, Calendar, FileText, Wallet, Star, MessageSquare, Sparkles, Bell, LogOut,
  Search, PlusCircle, CheckCircle, Clock, XCircle, ChevronRight, TrendingUp, Users,
  ArrowUpRight, ArrowDownRight, Edit2, Archive, ArrowRight, Share2, Upload, Trash2,
  Video, QrCode, CreditCard, Send, Paperclip, Mic, Smile, Pin, FolderArchive,
  HelpCircle, Eye, ShieldAlert, Sparkle, Download, Check, AlertCircle, RefreshCw
} from 'lucide-react';

const OwnerHome = () => {
  const { user, token, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'properties', 'bookings', 'rentals', 'wallet', 'reviews', 'messages', 'ai', 'notifications'
  
  // Dashboard & global state
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rentRequests, setRentRequests] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChatPartner, setActiveChatPartner] = useState(null);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [chatMessageText, setChatMessageText] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Quick Actions & Modal Toggles
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [scannedBookingId, setScannedBookingId] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [selectedRentRequest, setSelectedRentRequest] = useState(null);

  // AI Description Generator state
  const [aiKeywords, setAiKeywords] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  // Todo tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review Alice Rent Offer', done: false },
    { id: 2, text: 'Upload Floorplan for Luxury Villa', done: true },
    { id: 3, text: 'Confirm Sunday visit with Bob', done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Fetch configs
  const apiConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await axios.get('http://localhost:8000/api/dashboard/stats/owner', apiConfig);
      setStats(statsRes.data);

      // Fetch properties
      const propertiesRes = await axios.get('http://localhost:8000/api/owners/properties', apiConfig);
      setProperties(propertiesRes.data);

      // Fetch bookings
      const bookingsRes = await axios.get('http://localhost:8000/api/owners/bookings', apiConfig);
      setBookings(bookingsRes.data);

      // Fetch Rent Requests
      const rentRequestsRes = await axios.get('http://localhost:8000/api/dashboard/rent-requests', apiConfig);
      setRentRequests(rentRequestsRes.data);

      // Fetch Wallet
      const walletRes = await axios.get('http://localhost:8000/api/dashboard/wallet', apiConfig);
      setWallet(walletRes.data);

      // Fetch Reviews
      const reviewsRes = await axios.get('http://localhost:8000/api/dashboard/reviews', apiConfig);
      setReviews(reviewsRes.data);

      // Fetch Chat Threads
      const chatsRes = await axios.get('http://localhost:8000/api/dashboard/messages', apiConfig);
      setChats(chatsRes.data);

      // Fetch Announcements
      const announcementsRes = await axios.get('http://localhost:8000/api/dashboard/announcements', apiConfig);
      setAnnouncements(announcementsRes.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard records. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  // Load chat messages when active partner changes
  useEffect(() => {
    if (activeChatPartner) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/dashboard/messages/${activeChatPartner._id}`, apiConfig);
          setActiveChatMessages(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000); // Polling chat messages
      return () => clearInterval(interval);
    }
  }, [activeChatPartner]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Task controllers
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText, done: false }]);
    setNewTaskText('');
  };
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Rent Negotiator
  const handleNegotiation = async (requestId, status, counterAmount) => {
    try {
      const payload = { status };
      if (counterAmount) {
        payload.counterOfferAmount = Number(counterAmount);
        payload.counterOfferBy = user._id;
        payload.status = 'Negotiating';
      }
      await axios.put(`http://localhost:8000/api/dashboard/rent-requests/${requestId}`, payload, apiConfig);
      fetchData();
    } catch (err) {
      alert('Error updating lease status');
    }
  };

  // Sign Digital Lease agreement
  const signAgreement = async (requestId) => {
    try {
      await axios.put(`http://localhost:8000/api/dashboard/rent-requests/${requestId}`, {
        status: 'AgreementSigned',
        agreementText: `This digital tenancy contract is signed on ${new Date().toLocaleDateString()} between Owner ${user.name} and the approved Renter client.`
      }, apiConfig);
      fetchData();
    } catch (err) {
      alert('Agreement sign failed');
    }
  };

  // Chat message send
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activeChatPartner) return;
    try {
      const res = await axios.post('http://localhost:8000/api/dashboard/messages', {
        receiver: activeChatPartner._id,
        message: chatMessageText,
        type: 'text'
      }, apiConfig);
      setActiveChatMessages([...activeChatMessages, res.data]);
      setChatMessageText('');
      // update threads list
      const chatsRes = await axios.get('http://localhost:8000/api/dashboard/messages', apiConfig);
      setChats(chatsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Withdraw wallet request
  const submitWithdrawal = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    try {
      await axios.post('http://localhost:8000/api/dashboard/wallet/withdraw', {
        amount: Number(withdrawAmount)
      }, apiConfig);
      setWithdrawAmount('');
      setShowWithdrawModal(false);
      fetchData();
    } catch (err) {
      alert('Withdrawal request failed');
    }
  };

  // Scan QR Check-in request
  const handleQrCheckin = async (e) => {
    e.preventDefault();
    if (!scannedBookingId) return;
    try {
      await axios.put(`http://localhost:8000/api/owners/bookings/${scannedBookingId}`, {
        status: 'Confirmed'
      }, apiConfig);
      setShowQrModal(false);
      setScannedBookingId('');
      fetchData();
      alert('Tenant Checked In & Visit Confirmed successfully!');
    } catch (err) {
      alert('Invalid Booking ID. Verification failed.');
    }
  };

  // Reviews actions
  const replyReview = async (reviewId, replyText) => {
    try {
      await axios.post(`http://localhost:8000/api/dashboard/reviews/${reviewId}/reply`, { reply: replyText }, apiConfig);
      fetchData();
    } catch (err) {
      alert('Reply failed');
    }
  };

  const reportFake = async (reviewId) => {
    try {
      await axios.post(`http://localhost:8000/api/dashboard/reviews/${reviewId}/report`, { reason: 'Suspected spam review' }, apiConfig);
      fetchData();
      alert('Review reported to Admin moderation.');
    } catch (err) {
      alert('Report failed');
    }
  };

  // AI Description writer
  const runAiDescription = async () => {
    if (!aiKeywords.trim()) return;
    setGeneratingAi(true);
    setTimeout(() => {
      setGeneratedDesc(`Welcome to this ultra-premium, luxury dwelling offering top-tier ${aiKeywords} amenities. Nestled in a prime metropolitan sector, it exhibits scenic views, bespoke furnishings, state-of-the-art climate control, and rapid access to major transit lines.`);
      setGeneratingAi(false);
    }, 1500);
  };

  // New property form state
  const [newPropForm, setNewPropForm] = useState({
    title: '', description: '', location: '', rentAmount: '', propertyType: 'Apartment',
    furnishingStatus: 'Furnished', video: '', virtualTour: '', floorPlan: '', ownershipDoc: '',
    nearbySchools: '', nearbyHospitals: '', nearbyMetro: '', parking: 'Yes', tags: '', seoTitle: '', seoDesc: ''
  });

  const handleAddNewProperty = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newPropForm.title,
        description: newPropForm.description,
        location: newPropForm.location,
        rentAmount: Number(newPropForm.rentAmount),
        propertyType: newPropForm.propertyType,
        furnishingStatus: newPropForm.furnishingStatus,
        status: 'Draft',
        video: newPropForm.video,
        virtualTour: newPropForm.virtualTour,
        floorPlan: newPropForm.floorPlan,
        ownershipDoc: newPropForm.ownershipDoc,
        nearbySchools: newPropForm.nearbySchools.split(',').map(s => s.trim()),
        nearbyHospitals: newPropForm.nearbyHospitals.split(',').map(s => s.trim()),
        nearbyMetro: newPropForm.nearbyMetro.split(',').map(s => s.trim()),
        parking: newPropForm.parking,
        tags: newPropForm.tags.split(',').map(t => t.trim()),
        seoMetadata: {
          title: newPropForm.seoTitle || newPropForm.title,
          description: newPropForm.seoDesc || newPropForm.description
        },
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80']
      };

      await axios.post('http://localhost:8000/api/owners/properties', payload, apiConfig);
      setShowAddPropertyModal(false);
      setNewPropForm({
        title: '', description: '', location: '', rentAmount: '', propertyType: 'Apartment',
        furnishingStatus: 'Furnished', video: '', virtualTour: '', floorPlan: '', ownershipDoc: '',
        nearbySchools: '', nearbyHospitals: '', nearbyMetro: '', parking: 'Yes', tags: '', seoTitle: '', seoDesc: ''
      });
      fetchData();
    } catch (err) {
      alert('Error creating listing. Confirm owner verification approval.');
    }
  };

  const submitToApproval = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/owners/properties/${id}`, { status: 'Pending' }, apiConfig);
      fetchData();
    } catch (err) {
      alert('Failed to submit listing');
    }
  };

  const duplicateProperty = async (prop) => {
    try {
      const payload = {
        ...prop,
        title: `Copy of ${prop.title}`,
        status: 'Draft'
      };
      delete payload._id;
      await axios.post('http://localhost:8000/api/owners/properties', payload, apiConfig);
      fetchData();
    } catch (err) {
      alert('Duplicate failed');
    }
  };

  const archiveProperty = async (id, isArchived) => {
    try {
      await axios.put(`http://localhost:8000/api/owners/properties/${id}`, { status: isArchived ? 'Archived' : 'Draft' }, apiConfig);
      fetchData();
    } catch (err) {
      alert('Archive toggle failed');
    }
  };

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
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
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between p-5 hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
              <Building2 size={20} />
            </div>
            <span className="font-[Poppins] text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">HouseHunt</span>
          </div>

          <div className="mb-6 p-4 rounded-2xl bg-slate-800/40 border border-slate-800/50">
            <div className="flex items-center gap-3">
              <img src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} className="h-10 w-10 rounded-full object-cover border border-blue-500/50" alt="" />
              <div>
                <div className="text-xs text-slate-400">{getGreeting()}</div>
                <div className="text-sm font-semibold truncate max-w-[130px]">{user?.name}</div>
              </div>
            </div>
            {/* Completion rate bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Profile completion</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'home', label: 'Dashboard Home', icon: Home },
              { id: 'properties', label: 'Property Manager', icon: Building2 },
              { id: 'bookings', label: 'Booking Requests', icon: Calendar },
              { id: 'rentals', label: 'Rent Requests', icon: FileText },
              { id: 'wallet', label: 'Wallet Ledger', icon: Wallet },
              { id: 'reviews', label: 'Review Center', icon: Star },
              { id: 'messages', label: 'Chat Workspace', icon: MessageSquare },
              { id: 'ai', label: 'AI suggestions', icon: Sparkles },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 text-blue-400 shadow-inner' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </div>
                  {item.id === 'notifications' && (
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition w-full">
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,rgba(30,41,59,0.5),transparent_40%)]">
        {/* HEADER BAR */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-white capitalize md:block hidden">{activeTab.replace('-', ' ')} overview</span>
            {/* Mobile Title */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><Building2 size={16} /></div>
              <span className="font-bold text-white">HouseHunt</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Actions Buttons */}
            <div className="flex gap-2">
              <button onClick={() => setShowAddPropertyModal(true)} className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold text-white hover:scale-[1.02] shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5">
                <PlusCircle size={14} /> Add Property
              </button>
              <button onClick={() => setShowQrModal(true)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700/80 hover:bg-slate-700 transition flex items-center gap-1.5">
                <QrCode size={14} /> Check-In
              </button>
            </div>

            <div className="h-8 w-[1px] bg-slate-800"></div>

            <div className="relative">
              <button onClick={() => setActiveTab('notifications')} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 transition relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500"></span>
              </button>
            </div>
          </div>
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
              {/* TAB 1: DASHBOARD HOME                   */}
              {/* ======================================= */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-violet-950/30 to-slate-950 p-6 sm:p-8">
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(99,102,241,0.15),transparent_70%)]" />
                    <div className="relative max-w-xl">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                        <Sparkle size={12} className="animate-spin-slow" /> AI suggestion active
                      </span>
                      <h2 className="mt-4 font-[Poppins] text-2xl sm:text-3xl font-bold tracking-tight text-white">{getGreeting()}, {user?.name.split(' ')[0]}!</h2>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        Rent proposals in your sectors are up by 12% this month. Your Sky Villa listing holds the highest conversion yield. Consider boosting Bayside Suite listing to match current demand.
                      </p>
                    </div>
                  </div>

                  {/* Counters */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Properties', value: stats?.totalProperties || 0, change: '+1' },
                      { label: 'Approved Properties', value: stats?.approvedProperties || 0, change: '100% verify' },
                      { label: 'Total Views', value: stats?.totalViews || 482, change: '+18.5%' },
                      { label: 'Pending Approvals', value: stats?.pendingProperties || 0, change: 'Await admin' }
                    ].map((stat, i) => (
                      <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
                        <div className="text-xs font-semibold text-slate-400">{stat.label}</div>
                        <div className="mt-2 flex items-baseline justify-between">
                          <span className="text-2xl font-bold text-white">{stat.value}</span>
                          <span className="text-xs text-blue-400 font-semibold">{stat.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts & Graphs Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-base font-bold text-white">Monthly Earnings Revenue</h3>
                          <p className="text-xs text-slate-500">Historical performance across listings</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold">
                          <TrendingUp size={12} /> +12.4%
                        </span>
                      </div>
                      {/* Custom SVG line graph */}
                      <div className="h-48 w-full">
                        <svg className="h-full w-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/>
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                            </linearGradient>
                          </defs>
                          <path d="M 0 160 Q 125 100 250 140 T 500 40 L 500 200 L 0 200 Z" fill="url(#chartGradient)" />
                          <path d="M 0 160 Q 125 100 250 140 T 500 40" fill="none" stroke="#3b82f6" strokeWidth="3" />
                          {/* Data points */}
                          <circle cx="0" cy="160" r="4" fill="#3b82f6" />
                          <circle cx="125" cy="115" r="4" fill="#3b82f6" />
                          <circle cx="250" cy="140" r="4" fill="#3b82f6" />
                          <circle cx="375" cy="90" r="4" fill="#3b82f6" />
                          <circle cx="500" cy="40" r="4" fill="#3b82f6" />
                        </svg>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">Wallet & Withdrawal Summary</h3>
                        <p className="text-xs text-slate-500">Funds available for bank transfer</p>
                      </div>
                      <div className="my-6">
                        <div className="text-3xl font-bold text-white font-[Poppins]">${wallet?.balance || 12450}</div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <Clock size={12} className="text-amber-400" /> Pending withdrawals: ${wallet?.pendingWithdrawal || 850}
                        </div>
                      </div>
                      <button onClick={() => setShowWithdrawModal(true)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold text-white hover:scale-[1.02] shadow-lg shadow-blue-500/10 transition flex items-center justify-center gap-1.5">
                        <Wallet size={14} /> Request Fund Withdrawal
                      </button>
                    </div>
                  </div>

                  {/* Live Map Dashboard widget */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <MapPin size={16} className="text-rose-500" /> Live Maps Dashboard widget
                        </h3>
                        <p className="text-[10px] text-slate-500">Real-time status of listings, scheduled visits, and interested renters nearby</p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Live Properties</span>
                        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Interested Renters</span>
                        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Scheduled Visits</span>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-800">
                      <iframe
                        title="owner-live-map"
                        src="https://www.google.com/maps?q=Mumbai,India&output=embed"
                        className="h-64 w-full border-0"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Tasks, Calendars, Suggestions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Tasks */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-bold text-white mb-4">Today's Dashboard Checklist</h3>
                      <form onSubmit={addTask} className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newTaskText}
                          onChange={e => setNewTaskText(e.target.value)}
                          placeholder="New verification task..."
                          className="flex-1 rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                        />
                        <button type="submit" className="px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">+</button>
                      </form>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {tasks.map(task => (
                          <div key={task.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-850">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(task.id)}
                                className="rounded bg-slate-900 border-slate-750 accent-blue-500"
                              />
                              <span className={`text-xs ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.text}</span>
                            </label>
                            <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-rose-400 text-xs">Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Visit Calendar */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-bold text-white mb-4">Upcoming visits & calendars</h3>
                      <div className="space-y-3">
                        {bookings.filter(b => b.status === 'Confirmed').slice(0, 3).map(b => (
                          <div key={b._id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-white">{b.renterDetails?.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{b.property?.title}</div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                              <Calendar size={10} /> Confirmed Visit
                            </span>
                          </div>
                        ))}
                        {bookings.filter(b => b.status === 'Confirmed').length === 0 && (
                          <div className="text-center py-6 text-xs text-slate-500">No scheduled visits matching confirmed state.</div>
                        )}
                      </div>
                    </div>

                    {/* AI Suggestions Card */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                          <Sparkles size={14} className="text-violet-400" /> AI Suggestions
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          We compared your luxury villa listing against similar assets in Chicago Loop district. Setting rent price to $2,950 could lift conversions by 14%. Add virtual 360-degree tour to verify listings faster.
                        </p>
                      </div>
                      <button onClick={() => setActiveTab('ai')} className="mt-4 w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition">
                        View Suggested Metrics
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 2: PROPERTY MANAGER                 */}
              {/* ======================================= */}
              {activeTab === 'properties' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">All Properties catalog</h2>
                      <p className="text-xs text-slate-500">Configure approvals, duplicate, archive, and boost listings</p>
                    </div>
                    <button onClick={() => setShowAddPropertyModal(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold text-white hover:scale-[1.02] shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5">
                      <PlusCircle size={14} /> Add new Listing
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(prop => (
                      <div key={prop._id} className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden backdrop-blur-sm flex flex-col justify-between">
                        <div>
                          <img src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'} className="h-44 w-full object-cover" alt="" />
                          <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{prop.propertyType}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                prop.status === 'Live' || prop.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                prop.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                prop.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                              }`}>
                                {prop.status}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-white line-clamp-1">{prop.title}</h3>
                              <p className="text-xs text-slate-400 mt-1">{prop.location}</p>
                            </div>

                            <div className="text-lg font-bold text-white font-[Poppins]">${prop.rentAmount}/month</div>
                            
                            {/* Workflow timeline steps */}
                            <div className="pt-2 border-t border-slate-800/80">
                              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Approval workflow status</div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span className={`flex items-center gap-1 ${prop.status !== 'Draft' ? 'text-blue-400' : ''}`}><Check size={10} /> Draft</span>
                                <ChevronRight size={10} />
                                <span className={prop.status === 'Pending' ? 'text-amber-400' : (prop.status === 'Approved' || prop.status === 'Live') ? 'text-emerald-400' : ''}>Pending</span>
                                <ChevronRight size={10} />
                                <span className={(prop.status === 'Approved' || prop.status === 'Live') ? 'text-emerald-400 font-bold' : ''}>Approved</span>
                              </div>
                            </div>

                            {prop.status === 'Rejected' && prop.rejectionReason && (
                              <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400">
                                <strong>Rejection Reason:</strong> {prop.rejectionReason}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                          {prop.status === 'Draft' && (
                            <button onClick={() => submitToApproval(prop._id)} className="col-span-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">
                              Submit for Admin Approval
                            </button>
                          )}
                          <button onClick={() => duplicateProperty(prop)} className="py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition">
                            Duplicate
                          </button>
                          <button onClick={() => archiveProperty(prop._id, prop.status !== 'Archived')} className="py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition">
                            {prop.status === 'Archived' ? 'Restore' : 'Archive'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 3: BOOKING REQUESTS                 */}
              {/* ======================================= */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Booking Requests & Visits</h2>
                    <p className="text-xs text-slate-500">Manage tenant visit schedules, reschedule requests, and launch mock meeting rooms.</p>
                  </div>

                  <div className="space-y-4">
                    {bookings.map(book => (
                      <div key={book._id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-white">{book.renterDetails?.name || 'Alice Tenant'}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              book.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              book.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {book.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{book.property?.title}</p>
                          <div className="text-xs text-slate-500 flex items-center gap-4">
                            <span>Email: {book.renterDetails?.email}</span>
                            <span>Phone: {book.renterDetails?.phone}</span>
                          </div>
                          <div className="text-xs text-slate-500 italic font-semibold">Notes: "{book.renterDetails?.notes || 'No visit notes added'}"</div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {book.status === 'Pending' && (
                            <>
                              <button onClick={() => axios.put(`http://localhost:8000/api/owners/bookings/${book._id}`, { status: 'Confirmed' }, apiConfig).then(fetchData)} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition">
                                Accept Visit
                              </button>
                              <button onClick={() => axios.put(`http://localhost:8000/api/owners/bookings/${book._id}`, { status: 'Cancelled' }, apiConfig).then(fetchData)} className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition">
                                Reject
                              </button>
                            </>
                          )}
                          {book.status === 'Confirmed' && (
                            <button onClick={() => alert('Launching mock meeting room: https://meet.jit.si/househunt-visit-tour')} className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition flex items-center gap-1">
                              <Video size={14} /> Video Call
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="text-center py-10 text-sm text-slate-500">No booking requests submitted yet.</div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 4: RENT REQUESTS                    */}
              {/* ======================================= */}
              {activeTab === 'rentals' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Lease Agreements & Rent Offers</h2>
                    <p className="text-xs text-slate-500">Negotiate rent pricing, countersign digital contracts, and verify payment transactions.</p>
                  </div>

                  <div className="space-y-4">
                    {rentRequests.map(req => (
                      <div key={req._id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-white">{req.tenant?.name}</h3>
                            <span className="text-xs text-slate-400">Proposed: <strong>${req.proposedRent}</strong></span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              req.status === 'AgreementSigned' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              req.status === 'Negotiating' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">Property: {req.property?.title}</p>
                          {req.counterOfferAmount && (
                            <div className="text-xs text-slate-400">
                              Current Counteroffer: <strong>${req.counterOfferAmount}</strong>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedRentRequest(req)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-255 transition hover:bg-slate-700">View Profile</button>
                          {req.status === 'Pending' && (
                            <>
                              <button onClick={() => handleNegotiation(req._id, 'Approved')} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-xs font-bold text-white">Approve</button>
                              <button onClick={() => {
                                const amount = prompt('Enter counter offer amount:');
                                if (amount) handleNegotiation(req._id, 'Negotiating', amount);
                              }} className="px-3 py-1.5 rounded-xl bg-amber-600 text-xs font-bold text-white">Counter Offer</button>
                            </>
                          )}
                          {req.status === 'Negotiating' && (
                            <span className="text-xs text-slate-500 italic">Waiting for renter answer...</span>
                          )}
                          {req.status === 'Approved' && (
                            <button onClick={() => signAgreement(req._id)} className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-xs font-bold text-white flex items-center gap-1.5">
                              <FileText size={14} /> Sign digital contract
                            </button>
                          )}
                          {req.status === 'AgreementSigned' && (
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><Check size={14} /> Lease signed!</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {rentRequests.length === 0 && (
                      <div className="text-center py-10 text-sm text-slate-500">No rent requests or negotiations are active.</div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 5: WALLET                           */}
              {/* ======================================= */}
              {activeTab === 'wallet' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between h-44">
                      <div>
                        <span className="text-xs text-slate-400">Total Account Balance</span>
                        <div className="text-3xl font-bold text-white mt-2 font-[Poppins]">${wallet?.balance || 12450}</div>
                      </div>
                      <button onClick={() => setShowWithdrawModal(true)} className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold text-white transition">
                        Withdraw Funds
                      </button>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between h-44">
                      <div>
                        <span className="text-xs text-slate-400">Pending Withdrawals</span>
                        <div className="text-3xl font-bold text-amber-400 mt-2 font-[Poppins]">${wallet?.pendingWithdrawal || 850}</div>
                      </div>
                      <span className="text-xs text-slate-500">Requires 24-48h processing</span>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between h-44">
                      <div>
                        <span className="text-xs text-slate-400">Platform Commission (5%)</span>
                        <div className="text-3xl font-bold text-slate-300 mt-2 font-[Poppins]">$622.50</div>
                      </div>
                      <span className="text-xs text-slate-500">Includes 18% GST deductions</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-4">Financial Ledger & Invoices</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-400">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                            <th className="pb-3">Invoice No</th>
                            <th className="pb-3">Description</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Type</th>
                            <th className="pb-3">Commission (5%)</th>
                            <th className="pb-3">GST (18%)</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Invoice</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {wallet?.transactions?.map(tx => (
                            <tr key={tx._id} className="hover:bg-slate-800/10">
                              <td className="py-4 font-mono">{tx.invoiceNumber}</td>
                              <td className="py-4 font-semibold text-slate-200">{tx.description}</td>
                              <td className="py-4 text-white font-bold">${tx.amount}</td>
                              <td className="py-4 uppercase font-bold text-xs">{tx.type}</td>
                              <td className="py-4">${tx.commission || 0}</td>
                              <td className="py-4">${tx.gst || 0}</td>
                              <td className="py-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                              <td className="py-4">
                                <button onClick={() => alert(`Mocking PDF download for ${tx.invoiceNumber}`)} className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-white transition"><Download size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 6: REVIEWS                          */}
              {/* ======================================= */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Review Center & Rating Analytics</h2>
                    <p className="text-xs text-slate-500">Monitor guest feedback, post replies, and flag inappropriate comments.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map(rev => (
                      <div key={rev._id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={rev.tenant?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} className="h-9 w-9 rounded-full object-cover" alt="" />
                            <div>
                              <div className="text-xs font-bold text-white">{rev.tenant?.name}</div>
                              <div className="text-[10px] text-slate-500">Property: {rev.property?.title}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={14} fill="currentColor" />
                            <span className="text-xs font-bold">{rev.rating}/5</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300">"{rev.comment}"</p>

                        {rev.reply && (
                          <div className="p-3 rounded bg-slate-950/60 border border-slate-850 text-xs text-slate-400">
                            <strong>Your Reply:</strong> "{rev.reply}"
                          </div>
                        )}

                        {!rev.reply && (
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const val = e.target.elements.replyInput.value;
                            if (val) replyReview(rev._id, val);
                          }} className="flex gap-2">
                            <input
                              name="replyInput"
                              placeholder="Post owner reply..."
                              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                            />
                            <button type="submit" className="px-3 rounded-xl bg-blue-600 text-xs font-bold">Reply</button>
                          </form>
                        )}

                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-850">
                          <span>Submitted: {new Date(rev.createdAt).toLocaleDateString()}</span>
                          {!rev.reported ? (
                            <button onClick={() => reportFake(rev._id)} className="text-rose-400 hover:underline">Report fake review</button>
                          ) : (
                            <span className="text-rose-500 font-semibold">Reported</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {reviews.length === 0 && (
                      <div className="text-center py-10 text-sm text-slate-500 col-span-2">No reviews left by tenants yet.</div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 7: MESSAGES                         */}
              {/* ======================================= */}
              {activeTab === 'messages' && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm h-[500px] flex overflow-hidden">
                  {/* Threads sidebar */}
                  <div className="w-1/3 border-r border-slate-800 flex flex-col justify-between">
                    <div className="p-4 border-b border-slate-800">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                        <input placeholder="Search inbox..." className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
                      {chats.map((ch, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveChatPartner(ch.user)}
                          className={`w-full text-left p-3.5 flex items-center gap-3 transition ${
                            activeChatPartner?._id === ch.user._id ? 'bg-blue-600/10' : 'hover:bg-slate-800/20'
                          }`}
                        >
                          <img src={ch.user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} className="h-10 w-10 rounded-full object-cover" alt="" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white truncate">{ch.user.name}</span>
                              <span className="text-[9px] text-slate-500">{new Date(ch.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{ch.lastMessage}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Messaging work panel */}
                  <div className="flex-1 flex flex-col justify-between bg-slate-950/20">
                    {activeChatPartner ? (
                      <>
                        <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={activeChatPartner.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} className="h-9 w-9 rounded-full object-cover" alt="" />
                            <div>
                              <div className="text-xs font-bold text-white">{activeChatPartner.name}</div>
                              <div className="text-[9px] text-emerald-400 font-semibold">Active now / typing...</div>
                            </div>
                          </div>
                        </div>

                        {/* Message list */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                          {activeChatMessages.map(msg => {
                            const isMe = msg.sender === user._id;
                            return (
                              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs p-3 rounded-2xl text-xs ${
                                  isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'
                                }`}>
                                  <p>{msg.message}</p>
                                  <span className="block text-[8px] text-right mt-1 text-slate-300">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Send bar */}
                        <form onSubmit={sendChatMessage} className="p-4 border-t border-slate-800 flex gap-2">
                          <input
                            value={chatMessageText}
                            onChange={e => setChatMessageText(e.target.value)}
                            placeholder="Type a premium message..."
                            className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                          />
                          <button type="submit" className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"><Send size={16} /></button>
                        </form>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <MessageSquare size={48} className="mb-2 text-slate-700" />
                        <span className="text-xs">Select any renter thread to start instant chat.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 8: AI SUGGESTIONS                   */}
              {/* ======================================= */}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-1.5"><Sparkles size={20} className="text-violet-400 animate-pulse" /> AI Listing Copilot</h2>
                    <p className="text-xs text-slate-500">Generate descriptive features, optimize valuation margins, and score listings against local market averages.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
                      <h3 className="text-sm font-bold text-white">AI Description Generator</h3>
                      <p className="text-xs text-slate-400">Describe attributes separation (e.g., 'pool, near subway, skyline views'):</p>
                      <div className="flex gap-2">
                        <input
                          value={aiKeywords}
                          onChange={e => setAiKeywords(e.target.value)}
                          placeholder="subway access, gym room, private balcony..."
                          className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                        />
                        <button onClick={runAiDescription} disabled={generatingAi} className="px-4 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
                          {generatingAi ? 'Writing...' : 'Generate'}
                        </button>
                      </div>
                      {generatedDesc && (
                        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 text-xs text-slate-300 select-all leading-relaxed relative">
                          <span className="absolute top-2 right-2 text-[9px] text-blue-400 uppercase font-semibold">Copy Description</span>
                          {generatedDesc}
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
                      <h3 className="text-sm font-bold text-white">AI Predictive Yield Analytics</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between text-xs">
                          <span>AI Investment Safety Score</span>
                          <span className="font-bold text-emerald-400 font-mono">94% (A+)</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between text-xs">
                          <span>Optimal Suggested Rent Price</span>
                          <span className="font-bold text-white font-mono">$4,850/mo</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between text-xs">
                          <span>Occupancy probability score</span>
                          <span className="font-bold text-blue-400 font-mono">92.4% (Rapid match)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* TAB 9: NOTIFICATIONS                    */}
              {/* ======================================= */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Notifications Center</h2>
                    <p className="text-xs text-slate-500">Monitor updates on listings approval, rent payments, and guest ratings.</p>
                  </div>

                  <div className="space-y-3">
                    {announcements.map(an => (
                      <div key={an._id} className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Bell size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{an.title}</div>
                          <p className="text-xs text-slate-400 mt-1">{an.content}</p>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Wallet size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Rent payment deposit confirmed</div>
                        <p className="text-xs text-slate-400 mt-1">Tenant deposited $4,500 for Sky Penthouse. Commission & GST deducted automatically.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">New Booking Request Submitted</div>
                        <p className="text-xs text-slate-400 mt-1">Renter Alice Tenant requested a property tour next week.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ======================================= */}
      {/* DIALOG 1: ADD PROPERTY MODAL             */}
      {/* ======================================= */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">List New Property (Approval workflow)</h3>
              <button onClick={() => setShowAddPropertyModal(false)} className="text-slate-400 hover:text-white"><XCircle size={20} /></button>
            </div>

            <form onSubmit={handleAddNewProperty} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Listing Title</label>
                <input
                  required
                  value={newPropForm.title}
                  onChange={e => setNewPropForm({ ...newPropForm, title: e.target.value })}
                  placeholder="Skyline luxury villa with terrace"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Rent Amount /month</label>
                <input
                  required
                  type="number"
                  value={newPropForm.rentAmount}
                  onChange={e => setNewPropForm({ ...newPropForm, rentAmount: e.target.value })}
                  placeholder="3400"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Property Type</label>
                <select
                  value={newPropForm.propertyType}
                  onChange={e => setNewPropForm({ ...newPropForm, propertyType: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Location description</label>
                <input
                  required
                  value={newPropForm.location}
                  onChange={e => setNewPropForm({ ...newPropForm, location: e.target.value })}
                  placeholder="Loop district, Chicago, IL"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newPropForm.description}
                  onChange={e => setNewPropForm({ ...newPropForm, description: e.target.value })}
                  placeholder="Detail your beautiful property perks and neighborhood options..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 border-t border-slate-800 pt-4 mt-2">
                <h4 className="text-xs font-bold text-white mb-3">SaaS advanced details & Nearby POIs</h4>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Nearby Schools (comma separated)</label>
                <input
                  value={newPropForm.nearbySchools}
                  onChange={e => setNewPropForm({ ...newPropForm, nearbySchools: e.target.value })}
                  placeholder="Lincoln High, Oak elementary"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Nearby Metro lines (comma separated)</label>
                <input
                  value={newPropForm.nearbyMetro}
                  onChange={e => setNewPropForm({ ...newPropForm, nearbyMetro: e.target.value })}
                  placeholder="Red line, Blue line subway"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 flex gap-4">
                <button type="button" onClick={() => alert('Mocking ownership document upload (PDF/Image)')} className="flex-1 py-3 rounded-xl border border-dashed border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-bold flex items-center justify-center gap-1.5">
                  <Upload size={14} /> Ownership Document
                </button>
                <button type="button" onClick={() => alert('Mocking Drag-and-Drop Image attachments')} className="flex-1 py-3 rounded-xl border border-dashed border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-bold flex items-center justify-center gap-1.5">
                  <Upload size={14} /> Property Images
                </button>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowAddPropertyModal(false)} className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold text-white">Save as Draft</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================= */}
      {/* DIALOG 2: WITHDRAWAL FUND MODAL          */}
      {/* ======================================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Withdraw Funds</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-white"><XCircle size={20} /></button>
            </div>

            <form onSubmit={submitWithdrawal} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Transfer Amount ($)</label>
                <input
                  required
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Target Bank Account details</label>
                <input
                  required
                  placeholder="Chase Bank, Acct 1002231-102"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Withdraw</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================= */}
      {/* DIALOG 3: SCAN QR CHECKIN MODAL          */}
      {/* ======================================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">QR Code Check-In Verification</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white"><XCircle size={20} /></button>
            </div>

            <form onSubmit={handleQrCheckin} className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 flex flex-col items-center justify-center space-y-2">
                <QrCode size={120} className="text-slate-300" />
                <span className="text-[10px] text-slate-500">Scan renter visit ticket QR or paste Booking ID below:</span>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold mb-1.5 block">Booking ID</label>
                <input
                  required
                  value={scannedBookingId}
                  onChange={e => setScannedBookingId(e.target.value)}
                  placeholder="Paste Booking ObjectID e.g. 64b85d..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================= */}
      {/* DIALOG 4: RENT REQUEST DETAILS MODAL     */}
      {/* ======================================= */}
      {selectedRentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Rent Request & Applicant Details</h3>
              <button onClick={() => setSelectedRentRequest(null)} className="text-slate-400 hover:text-white"><XCircle size={20} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto pr-1 text-xs">
              <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800 sm:col-span-2">
                <img src={selectedRentRequest.tenant?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} className="h-16 w-16 rounded-full object-cover border border-blue-500/50" alt="" />
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedRentRequest.tenant?.name}</h4>
                  <div className="text-slate-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Occupation: <strong>{selectedRentRequest.occupation || 'Professional'}</strong></span>
                    <span>Family Size: <strong>{selectedRentRequest.familySize || 1} members</strong></span>
                    <span>Income: <strong>${selectedRentRequest.monthlyIncome || 45000}/mo</strong></span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-300">Lease Terms</h5>
                <div className="space-y-2 bg-slate-950/20 p-3.5 rounded-2xl border border-slate-850">
                  <div className="flex justify-between"><span>Offered Rent:</span><span className="font-bold text-white">${selectedRentRequest.proposedRent}/mo</span></div>
                  <div className="flex justify-between"><span>Preferred Move-In:</span><span className="text-slate-300">{new Date(selectedRentRequest.preferredMoveInDate || Date.now()).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span>Lease Duration:</span><span className="text-slate-300">{selectedRentRequest.rentalDuration || 12} months</span></div>
                  <div className="flex justify-between"><span>Distance to Property:</span><span className="text-slate-300">{selectedRentRequest.distanceFromProperty || 2.5} km</span></div>
                  <div className="flex justify-between"><span>Est. Travel Time:</span><span className="text-slate-300">{selectedRentRequest.travelTime || '15 mins'}</span></div>
                </div>
                <div className="p-3 bg-slate-950/20 rounded-2xl border border-slate-850">
                  <h6 className="font-bold text-slate-400 mb-1">Renter Notes:</h6>
                  <p className="text-slate-300 italic">"{selectedRentRequest.additionalNotes || 'No notes left'}"</p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-300">Route & Location Mapping</h5>
                <div className="rounded-2xl overflow-hidden border border-slate-800">
                  <iframe
                    title="renter-route-map"
                    src={`https://www.google.com/maps?q=${selectedRentRequest.property?.location || 'Chicago'}&output=embed`}
                    className="h-44 w-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button onClick={() => setSelectedRentRequest(null)} className="px-4 py-2 rounded-xl bg-slate-850 text-slate-200">Close</button>
                <button onClick={() => {
                  handleNegotiation(selectedRentRequest._id, 'Approved');
                  setSelectedRentRequest(null);
                }} className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700">Accept Offer</button>
                <button onClick={() => {
                  handleNegotiation(selectedRentRequest._id, 'Rejected');
                  setSelectedRentRequest(null);
                }} className="px-4 py-2 rounded-xl bg-rose-600 font-bold text-white hover:bg-rose-700">Reject</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OwnerHome;
