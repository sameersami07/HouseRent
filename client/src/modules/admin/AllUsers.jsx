import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, Building2, Sparkles } from 'lucide-react';

const AllUsers = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:8000/api/admin/users', config);
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const handleApproveOwner = async (id, currentApprovalStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8000/api/admin/users/${id}/approve`, {
        isApproved: !currentApprovalStatus,
      }, config);
      fetchUsers();
    } catch (err) {
      setError('Failed to update owner verification status');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] text-slate-700">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-8 py-6 shadow-xl backdrop-blur">Loading user directory…</div>
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
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
            <Sparkles size={16} /> User management
          </div>
          <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">User directory and verification</h1>
          <p className="mt-2 text-sm text-slate-600">Review accounts, verify owners, and keep the platform community trusted.</p>
        </div>

        {error && <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

        <div className="grid gap-4 lg:grid-cols-2">
          {users.map((item) => (
            <div key={item._id} className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={item.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <div className="font-[Poppins] text-lg font-semibold text-slate-900">{item.name}</div>
                    <div className="text-sm text-slate-500">{item.email}</div>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${item.userType === 'owner' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'}`}>
                  {item.userType}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <div><span className="font-semibold text-slate-800">Phone:</span> {item.phone}</div>
                <div><span className="font-semibold text-slate-800">Location:</span> {item.currentLocation || 'Not specified'}</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {item.isApproved ? 'Approved' : 'Pending approval'}
                </span>
                {item.userType === 'owner' && (
                  <button onClick={() => handleApproveOwner(item._id, item.isApproved)} className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isApproved ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {item.isApproved ? 'Revoke approval' : 'Approve owner'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllUsers;
