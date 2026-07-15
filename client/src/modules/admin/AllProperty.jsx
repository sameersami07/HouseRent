import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import AllPropertiesCards from '../user/AllPropertiesCards';
import { ArrowLeft, Building2, Sparkles } from 'lucide-react';

const AllProperty = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProperties = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:8000/api/admin/properties', config);
        setProperties(res.data);
      } catch (err) {
        setError('Failed to fetch platform property listings');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] text-slate-700">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-8 py-6 shadow-xl backdrop-blur">Loading property directory…</div>
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
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            <Sparkles size={16} /> Platform catalog
          </div>
          <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Listed properties directory</h1>
          <p className="mt-2 text-sm text-slate-600">Browse every verified listing with a polished, premium overview.</p>
        </div>

        {error && <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>}

        {properties.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm">
            <h2 className="font-[Poppins] text-xl font-semibold text-slate-900">No properties yet</h2>
            <p className="mt-2 text-sm text-slate-600">Listings will appear here as soon as owners publish them.</p>
          </div>
        ) : (
          <AllPropertiesCards
            properties={properties}
            showOwner={true}
            onGetInfo={(prop) => alert(`Property owner contact: ${prop.owner?.name} (${prop.owner?.email})`)}
            buttonText="Show owner details"
          />
        )}
      </main>
    </div>
  );
};

export default AllProperty;
