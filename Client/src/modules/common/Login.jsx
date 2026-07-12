import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { Home, Lock, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/users/login', { email, password });
      const { token, ...userData } = res.data;
      login(userData, token);

      if (userData.userType === 'admin') {
        navigate('/admin');
      } else if (userData.userType === 'owner') {
        navigate('/owner');
      } else {
        navigate('/renter');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),transparent_30%),linear-gradient(120deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-white/75 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="relative hidden flex-1 items-end justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700 p-10 lg:flex">
          <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80" alt="Modern home" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/25 to-transparent" />
          <div className="relative z-10 max-w-md text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm backdrop-blur">
              <Sparkles size={16} />
              Welcome back to HouseHunt
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight">Discover spaces that feel like home.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">Book visits, contact owners, and manage your dream property journey in one elegant dashboard.</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex-1 p-6 sm:p-8 lg:p-10">
          <Link to="/" className="mb-8 inline-flex items-center gap-3 font-semibold text-slate-700">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
              <Home size={18} />
            </div>
            HouseHunt
          </Link>

          <div className="mx-auto max-w-md">
            <h1 className="font-[Poppins] text-3xl font-semibold text-slate-900">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">Access your account and continue your property search.</p>

            {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600"><Mail size={16} /> Email</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-none bg-transparent text-sm outline-none" placeholder="you@example.com" />
              </label>

              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600"><Lock size={16} /> Password</span>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-none bg-transparent text-sm outline-none" placeholder="••••••••" />
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" className="rounded border-slate-300" /> Remember me</label>
                <Link to="/forgot-password" className="font-semibold text-blue-600">Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Don’t have an account? <Link to="/register" className="font-semibold text-blue-600">Create one</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
