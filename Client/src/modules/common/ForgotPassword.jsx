import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, KeyRound, House, ShieldCheck } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/users/forgot-password', {
        email,
        phone,
        newPassword,
      });
      setMessage(res.data.message || 'Password reset successful!');
      setEmail('');
      setPhone('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating password. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 px-6 py-8 text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-lg font-semibold">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
              <House size={18} />
            </div>
            HouseHunt
          </Link>
          <div className="mt-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
              <ShieldCheck size={15} /> Secure recovery
            </div>
            <h1 className="mt-3 text-2xl font-semibold">Reset your password</h1>
            <p className="mt-2 text-sm text-blue-50">Use your verified details to update your account password safely.</p>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {message && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" placeholder="Phone number" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">New password</label>
              <div className="relative">
                <KeyRound size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white" placeholder="Create a strong password" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Updating...' : 'Update password'}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Remembered it?{' '}
            <Link to="/login" className="font-semibold text-blue-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
