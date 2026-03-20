'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FiLinkedin, FiBriefcase, FiUser, FiMail, FiCheckCircle, FiSearch, FiFilter } from 'react-icons/fi';
import api from '@/lib/api';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await api.get('/team');
        setAlumni(res.data.data.filter(m => m.category === 'Alumni'));
      } catch (err) {
        console.error('Error fetching alumni:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  const batches = ['All', ...Array.from(new Set(alumni.map(a => a.batch || 'N/A'))).sort().reverse()];

  const filteredAlumni = alumni.filter(alum => {
    const matchesSearch = 
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alum.company && alum.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alum.formerPosition && alum.formerPosition.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBatch = selectedBatch === 'All' || (alum.batch || 'N/A') === selectedBatch;
    
    return matchesSearch && matchesBatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      <div className="bg-black py-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">E-Cell <span className="text-[#FFB800]">Alumni.</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Our legacy lives on through our alumni who have paved the way for future entrepreneurs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between sticky top-20 z-30 bg-white/80 backdrop-blur-md py-4 rounded-3xl border border-gray-100 px-6 shadow-sm">
            <div className="relative w-full md:max-w-md">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by name, role, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black"
                />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                <FiFilter className="text-gray-400 shrink-0 hidden md:block" size={18} />
                {batches.map((batch) => (
                    <button
                        key={batch}
                        onClick={() => setSelectedBatch(batch)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shrink-0 ${
                            selectedBatch === batch 
                            ? 'bg-black text-white shadow-lg' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        {batch === 'All' ? 'All Batches' : `Class of ${batch}`}
                    </button>
                ))}
            </div>
        </div>

        {filteredAlumni.length === 0 ? (
          <div className="text-center py-32">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <FiSearch size={40} />
              </div>
              <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">No results found</h3>
              <p className="text-gray-400 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedBatch('All');}}
                className="mt-8 text-[#FFB800] font-black uppercase tracking-widest text-xs hover:underline"
              >
                Clear all filters
              </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredAlumni.map((alum) => (
                <motion.div 
                   layout
                   key={alum._id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.3 }}
                   className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 group"
                >
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-sm transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
                    {alum.image ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${alum.image}`} 
                          alt={alum.name} 
                          className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FiUser size={32} />
                        </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black mb-1 tracking-tight group-hover:text-[#FFB800] transition-colors">{alum.name}</h3>
                    <p className="text-[#FFB800] font-black text-xs uppercase tracking-[0.2em]">Batch of {alum.batch || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-700 font-bold">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                      <FiBriefcase size={16} />
                    </div>
                    {alum.role} {alum.company && <><span className="text-gray-300">@</span> {alum.company}</>}
                  </div>
                  {alum.formerPosition && (
                    <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] transition-colors">
                        <FiCheckCircle size={14} />
                      </div>
                      Was {alum.formerPosition}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">IIIT TRICHY E-CELL</span>
                  <div className="flex gap-2">
                    {alum.email && (
                      <a 
                        href={`mailto:${alum.email}`} 
                        className="w-10 h-10 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center hover:bg-[#FFB800] hover:text-black transition-all"
                        title={alum.email}
                      >
                        <FiMail size={18} />
                      </a>
                    )}
                    {alum.linkedin && (
                      <a 
                        href={alum.linkedin} 
                        target="_blank" 
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#FFB800] hover:text-black transition-all shadow-lg"
                      >
                        <FiLinkedin size={14} /> CONNECT
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
