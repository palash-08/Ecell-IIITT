'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiArrowRight, FiSearch, FiFilter, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesFilter = filter === 'All' || e.category === filter;
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['All', 'Flagship', 'Hackathon', 'Workshop', 'Seminar'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-black py-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB800] rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">Explore <span className="text-[#FFB800]">Events.</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl font-medium leading-relaxed">
            From flagship summits to intensive workshops, stay updated with the entrepreneurial ecosystem at IIIT Trichy.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[80px] z-30 bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === cat ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search event name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-400">No events found in this category.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link 
                key={event._id}
                href={`/events/${event._id}`}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full no-underline"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={event.mainImage ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${event.mainImage}` : '/Ecelllogo.jpeg'} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-black text-[10px] font-black rounded-full shadow-xl uppercase tracking-[0.2em] border border-white/50">
                        {event.category}
                    </span>
                    {(() => {
                      const eventDate = new Date(event.date);
                      eventDate.setHours(0, 0, 0, 0);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isCompleted = event.status === 'Completed' || eventDate < today;
                      const displayStatus = isCompleted ? 'Completed' : 'Upcoming';
                      
                      return (
                        <span className={`px-4 py-1.5 backdrop-blur-md text-white text-[10px] font-black rounded-full shadow-xl uppercase tracking-[0.2em] border border-white/20 ${!isCompleted ? 'bg-amber-500/80' : 'bg-green-500/80'}`}>
                          {displayStatus}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                
                <div className="p-10 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-black mb-6 line-clamp-2 leading-tight group-hover:text-[#FFB800] transition-colors">
                    {event.title}
                  </h3>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8">
                    <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
                        <FiCalendar size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-black">Date</span>
                        <span className="text-gray-700">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
                        <FiClock size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-black">Time</span>
                        <span className="text-gray-700">{event.startTime || 'TBD'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest col-span-2 mt-1">
                      <div className="w-8 h-8 min-w-[32px] rounded-lg bg-gray-50 flex items-center justify-center text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
                        <FiMapPin size={14} />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-gray-400 font-black">Venue</span>
                        <span className="text-gray-700 truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 font-medium mb-10 line-clamp-2 leading-relaxed text-sm">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center group/btn">
                    <span className="flex items-center gap-2 text-black font-black uppercase tracking-[0.2em] text-[10px] group-hover:text-[#FFB800] transition-colors">
                      View Details <FiArrowRight className="text-[#FFB800] group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
