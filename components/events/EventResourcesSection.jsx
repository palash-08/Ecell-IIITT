import React from 'react';
import { FiLink, FiArrowUpRight } from 'react-icons/fi';

const EventResourcesSection = ({ links }) => {
  if (!links || links.length === 0) return null;

  return (
    <section className="mb-16">
      <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
        <FiLink className="text-[#FFB800]" /> Useful Resources
      </h3>
      <div className="flex flex-wrap gap-4">
        {links.map((link, i) => (
          <a 
            key={i} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[#FFB800] hover:bg-[#FFB800]/5 transition-all group"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-[#FFB800] group-hover:text-black transition-colors">
              <FiLink size={18} />
            </div>
            <span className="font-bold text-gray-700">{link.label}</span>
            <FiArrowUpRight className="text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        ))}
      </div>
    </section>
  );
};

export default EventResourcesSection;
