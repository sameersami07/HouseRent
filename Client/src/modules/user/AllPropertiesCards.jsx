import React from 'react';
import { motion } from 'framer-motion';
import { Bath, BedDouble, MapPin, Square, Sparkles } from 'lucide-react';

const AllPropertiesCards = ({ properties, onGetInfo, buttonText = 'Get Info', showOwner = false }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <motion.article key={property._id} whileHover={{ y: -4, scale: 1.01 }} className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <img
            src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
            alt={property.title}
            className="h-48 w-full object-cover"
          />
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                {property.propertyType}
              </span>
              <div className="text-right">
                <div className="font-[Poppins] text-lg font-semibold text-slate-900">${property.rentAmount}</div>
                <div className="text-xs text-slate-500">/month</div>
              </div>
            </div>
            <h3 className="mt-4 font-[Poppins] text-xl font-semibold text-slate-900">{property.title}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={15} className="text-rose-500" />
              {property.location}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"><BedDouble size={14} /> {property.furnishingStatus}</span>
              {property.amenities?.slice(0, 2).map((amenity, idx) => (
                <span key={idx} className="rounded-full bg-slate-100 px-3 py-2">{amenity}</span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><BedDouble size={15} /> 3 beds</span>
              <span className="inline-flex items-center gap-2"><Bath size={15} /> 2 baths</span>
              <span className="inline-flex items-center gap-2"><Square size={15} /> 1,800 sq ft</span>
            </div>
            {showOwner && property.owner && (
              <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4">
                <img src={property.owner.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt={property.owner.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{property.owner.name}</div>
                  <div className="text-xs text-slate-500">Verified owner</div>
                </div>
              </div>
            )}
            {onGetInfo && (
              <button onClick={() => onGetInfo(property)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
                <Sparkles size={15} /> {property.status === 'Booked' && buttonText === 'Get Info' ? 'Booked' : buttonText}
              </button>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default AllPropertiesCards;
