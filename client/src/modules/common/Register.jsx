import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { Home, Sparkles } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 'renter',
    currentLocation: '',
    profileImage: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/users/register', formData);
      const { token, ...userData } = res.data;
      login(userData, token);

      if (userData.userType === 'owner') {
        navigate('/owner');
      } else {
        navigate('/renter');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),transparent_30%),linear-gradient(120deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:flex-row">
        <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-violet-800 p-8 text-white lg:p-10">
          <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80" alt="Luxury residence" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-800/25 to-transparent" />
          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm backdrop-blur">
              <Sparkles size={16} />
              Join HouseHunt today
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight">Create an account and unlock premium listings.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">Whether you’re renting, listing, or managing properties, every journey starts with a polished profile.</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex-1 p-6 sm:p-8 lg:p-10">
          <Link to="/" className="mb-8 inline-flex items-center gap-3 font-semibold text-slate-700">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
              <Home size={18} />
            </div>
            HouseHunt
          </Link>

          <div className="mx-auto max-w-xl">
            <h1 className="font-[Poppins] text-3xl font-semibold text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">Sign up in minutes and start exploring curated homes.</p>

            {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-600">Full name</span>
                <input name="name" required value={formData.name} onChange={handleChange} className="w-full border-none bg-transparent text-sm outline-none" placeholder="Ava Johnson" />
              </label>
              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <span className="mb-1 block text-sm font-medium text-slate-600">Email</span>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full border-none bg-transparent text-sm outline-none" placeholder="you@example.com" />
              </label>
              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <span className="mb-1 block text-sm font-medium text-slate-600">Phone</span>
                <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full border-none bg-transparent text-sm outline-none" placeholder="+1 555 0000" />
              </label>
              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <span className="mb-1 block text-sm font-medium text-slate-600">Password</span>
                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full border-none bg-transparent text-sm outline-none" placeholder="••••••••" />
              </label>
              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <span className="mb-1 block text-sm font-medium text-slate-600">Account type</span>
                <select name="userType" value={formData.userType} onChange={handleChange} className="w-full border-none bg-transparent text-sm outline-none">
                  <option value="renter">Renter / Tenant</option>
                  <option value="owner">Owner / Landlord</option>
                </select>
              </label>
              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <span className="mb-1 block text-sm font-medium text-slate-600">Current location</span>
                <input name="currentLocation" required value={formData.currentLocation} onChange={handleChange} className="w-full border-none bg-transparent text-sm outline-none" placeholder="Austin, TX" />
              </label>
              <label className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-600">Profile image URL (optional)</span>
                <input name="profileImage" value={formData.profileImage} onChange={handleChange} className="w-full border-none bg-transparent text-sm outline-none" placeholder="https://" />
              </label>

              <button type="submit" disabled={loading} className="sm:col-span-2 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-semibold text-blue-600">Sign in</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
