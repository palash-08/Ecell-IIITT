'use client';

import React, { useState, useEffect } from 'react'
import AboutSection from '@/components/about-section/AboutSection'
import VisionMission from '@/components/vision-mission/VisionMission'
import Image from 'next/image'
import { FaQuoteLeft } from 'react-icons/fa'
import { FiLinkedin, FiMail } from 'react-icons/fi'
import api from '@/lib/api'

const Page = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await api.get('/faculty');
        // Filter for active faculty only
        setFaculty(res.data.data.filter(f => f.active));
      } catch (err) {
        console.error('Error fetching faculty:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  return (
    <div className='min-h-screen flex flex-col pt-20 bg-[#F5F5F5]'>
        {/* Overview of E-Cell */}
        <AboutSection />
        
        {/* Vision & mission */}
        <VisionMission />

        {/* Faculty advisor section */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin mx-auto mr-2"></div>
            <span className="text-gray-400 font-bold">Loading Advisory...</span>
          </div>
        ) : faculty.length > 0 && (
          <section className="py-24 px-6 bg-white border-y border-gray-200">
              <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-16">
                      <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight">
                          A Message from Our <span className="text-[#FFB800]">Faculty Advisor</span>
                      </h2>
                  </div>
                  
                  {faculty.map((f, index) => (
                    <div key={f._id} className={`flex flex-col md:flex-row items-center gap-12 bg-[#F5F5F5] p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-200 ${index > 0 ? 'mt-12' : ''}`}>
                        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                            <img 
                                src={f.image ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/api$/, '')}${f.image}` : "/Ecelllogo.jpeg"} 
                                alt={f.name} 
                                className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
                            />
                        </div>
                        
                        <div className="flex-1 relative">
                            <FaQuoteLeft className="text-[#FFB800]/20 text-6xl absolute -top-6 -left-6 z-0" />
                            <div className="relative z-10">
                                <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed mb-8 italic">
                                    "{f.message}"
                                </p>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-gray-100 pt-8">
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-black mb-1">{f.name}</h3>
                                        <p className="text-[#FFB800] font-black text-sm uppercase tracking-widest">{f.role}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        {f.email && (
                                            <a 
                                                href={`mailto:${f.email}`} 
                                                className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all shadow-sm group/icon"
                                                title={f.email}
                                            >
                                                <FiMail size={20} />
                                            </a>
                                        )}
                                        {f.linkedin && (
                                            <a 
                                                href={f.linkedin} 
                                                target="_blank" 
                                                className="w-12 h-12 bg-[#0077b5] text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg"
                                            >
                                                <FiLinkedin size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  ))}
              </div>
          </section>
        )}
    </div>
  )
}

export default Page;
