'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '@/lib/api';

// Import reusable components
import PageHeader from '@/components/ui/PageHeader';
import MemberCard from '@/components/ui/MemberCard';

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
      <PageHeader 
        title="E-Cell" 
        highlight="Alumni." 
        description="Our legacy lives on through our alumni who have paved the way for future entrepreneurs."
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between top-[72px] md:top-[80px] z-30 bg-white/80 backdrop-blur-md py-4 md:py-6 rounded-3xl border border-gray-100 px-6 shadow-sm">
            <div className="relative w-full md:max-w-md">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by name, role, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-3.5 md:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black text-sm md:text-base"
                />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar w-full md:w-auto">
                <FiFilter className="text-gray-400 shrink-0 hidden md:block" size={18} />
                {batches.map((batch) => (
                    <button
                        key={batch}
                        onClick={() => setSelectedBatch(batch)}
                        className={`px-5 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all shrink-0 ${
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
              <p className="text-gray-400 font-medium">Try adjusting your search or filters to find what you&apos;re looking for.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedBatch('All');}}
                className="mt-8 text-[#FFB800] font-black uppercase tracking-widest text-xs hover:underline"
              >
                Clear all filters
              </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredAlumni.map((alum) => (
              <MemberCard key={alum._id} member={alum} variant="alumni" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
