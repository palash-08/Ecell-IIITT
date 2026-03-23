'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import MemberCard from '@/components/ui/MemberCard';

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        // Filter out alumni and inactive members
        setTeam(res.data.data.filter(m => m.category !== 'Alumni' && m.active));
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const categories = Array.from(new Set(team.map(m => m.category))).sort((a, b) => {
    if (a === 'Core Team') return -1;
    if (b === 'Core Team') return 1;
    if (a === 'Core') return -1;
    if (b === 'Core') return 1;
    return a.localeCompare(b);
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
        title="The" 
        highlight="Core." 
        description="The passionate team behind E-Cell IIIT Trichy, working tirelessly to foster innovation and entrepreneurship."
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        {categories.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold text-2xl">
              Our team is currently updating. Stay tuned!
          </div>
        ) : categories.map((cat) => (
          <div key={cat} className="mb-24 last:mb-0">
            <h2 className="text-3xl font-black text-black mb-12 flex items-center gap-4">
               {cat} <div className="h-1 flex-1 bg-gray-50"></div>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {team.filter(m => m.category === cat).map((member) => (
                <MemberCard key={member._id} member={member} variant="team" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
