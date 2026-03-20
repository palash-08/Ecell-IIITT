import React from 'react';
import { FiGrid } from 'react-icons/fi';

const EventHighlightsSection = ({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="mb-16">
      <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
        <FiGrid className="text-[#FFB800] shadow-sm" /> Event Highlights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {highlights.map((h, i) => (
          <div key={i} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl hover:border-[#FFB800]/30 transition-all group">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#FFB800] transition-colors">{h.label}</p>
            <p className="text-xl font-black text-black">{h.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventHighlightsSection;
