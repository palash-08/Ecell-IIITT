'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FiLinkedin, FiMail, FiUser } from 'react-icons/fi';
import api from '@/lib/api';

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        // Filter out alumni
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
      
      <div className="bg-black py-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">The <span className="text-[#FFB800]">Core.</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            The passionate team behind E-Cell IIIT Trichy, working tirelessly to foster innovation and entrepreneurship.
          </p>
        </div>
      </div>

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
              {team.filter(m => m.category === cat).map((member) => (
                <motion.div 
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 relative">
                    {member.image ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${member.image}`} 
                          alt={member.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FiUser size={80} />
                        </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        {member.linkedin && (
                            <a href={member.linkedin} target="_blank" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-[#FFB800] hover:text-black transition-all">
                                <FiLinkedin size={20} />
                            </a>
                        )}
                        <a href={`mailto:${member.name.split(' ')[0].toLowerCase()}@iiitt.ac.in`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#FFB800] transition-all">
                            <FiMail size={20} />
                        </a>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-black mb-1 text-center group-hover:text-[#FFB800] transition-colors">{member.name}</h3>
                  <p className="text-gray-500 font-bold text-sm text-center uppercase tracking-widest">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
