import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Compass, ShieldCheck, Sparkles, TrendingUp, MapPin, BedDouble, Bath, Square } from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Premium listings' },
  { value: '15K+', label: 'Happy customers' },
  { value: '500+', label: 'Cities covered' },
];

const features = [
  {
    title: 'Curated property discovery',
    text: 'Search stunning homes with smart filters, instant insights, and transparent pricing.',
    icon: Compass,
  },
  {
    title: 'Verified owners',
    text: 'Every owner is reviewed with secure communication and trustworthy listings.',
    icon: ShieldCheck,
  },
  {
    title: 'Real market clarity',
    text: 'Explore local trends, amenities, and price guidance in one premium experience.',
    icon: TrendingUp,
  },
];

const featuredHomes = [
  {
    title: 'Skyline Penthouse',
    location: 'Beverly Hills',
    price: '$3,200/mo',
    type: 'Luxury Apartment',
    beds: 3,
    baths: 2,
    area: '2,450 sq ft',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Harbor View Villa',
    location: 'Malibu',
    price: '$5,100/mo',
    type: 'Private Villa',
    beds: 4,
    baths: 3,
    area: '3,800 sq ft',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
              <Building2 size={20} />
            </div>
            <span className="font-[Poppins] text-xl font-semibold">HouseHunt</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#discover" className="transition hover:text-blue-600">Buy</a>
            <a href="#discover" className="transition hover:text-blue-600">Rent</a>
            <a href="#discover" className="transition hover:text-blue-600">Sell</a>
            <a href="#about" className="transition hover:text-blue-600">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.02]">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-10 lg:px-8 lg:pt-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.16),transparent_32%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-medium text-blue-700">
                <Sparkles size={16} />
                Premium home rentals at your fingertips
              </div>
              <h1 className="max-w-2xl font-[Poppins] text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Find your dream home with a premium experience.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Browse verified listings, book private tours, and discover neighborhoods that feel like home.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:translate-y-[-2px]">
                  Start exploring <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
                  Sign in
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                    <div className="font-[Poppins] text-2xl font-semibold text-slate-900">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
              <div className="absolute inset-0 -translate-y-6 translate-x-6 rounded-[32px] bg-gradient-to-br from-blue-600/25 to-violet-600/25 blur-3xl" />
              <div className="glass-panel relative overflow-hidden p-3">
                <img src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80" alt="Luxury home" className="h-[480px] w-full rounded-[24px] object-cover" />
                <div className="absolute inset-x-0 bottom-0 rounded-b-[24px] bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-8 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">Featured property</div>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <div className="font-[Poppins] text-2xl font-semibold">Oceanfront Residence</div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-200">
                        <MapPin size={16} />
                        Miami Beach
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">$4,900/mo</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="discover" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Why HouseHunt</p>
              <h2 className="mt-2 font-[Poppins] text-3xl font-semibold text-slate-900">A smarter way to find your next address</h2>
            </div>
            <p className="max-w-2xl text-slate-600">Beautifully crafted flows, private messaging, and seamless booking make the process feel effortless.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article key={feature.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="soft-card p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-[Poppins] text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <div className="glass-panel overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Trending homes</p>
                <h2 className="mt-2 font-[Poppins] text-3xl font-semibold text-slate-900">Handpicked spaces that feel extraordinary</h2>
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">View all homes <ArrowRight size={16} /></Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredHomes.map((home) => (
                <motion.article key={home.title} whileHover={{ y: -4, scale: 1.01 }} className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-slate-50 shadow-sm">
                  <img src={home.image} alt={home.title} className="h-56 w-full object-cover" />
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-[Poppins] text-xl font-semibold text-slate-900">{home.title}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500"><MapPin size={15} /> {home.location}</div>
                      </div>
                      <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{home.price}</div>
                    </div>
                    <div className="mt-4 text-sm font-medium text-slate-500">{home.type}</div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2"><BedDouble size={15} /> {home.beds} beds</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2"><Bath size={15} /> {home.baths} baths</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2"><Square size={15} /> {home.area}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
