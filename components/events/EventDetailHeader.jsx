import React from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiMapPin } from 'react-icons/fi';

const EventDetailHeader = ({ event }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  return (
    <div className="bg-black py-24 px-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <Link href="/events" className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition-colors mb-8 no-underline">
          <FiArrowLeft /> Back to Events
        </Link>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3 aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={event.mainImage ? `${API_URL}${event.mainImage}` : '/Ecelllogo.jpeg'} 
              alt={event.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <span className="px-4 py-1.5 bg-[#FFB800] text-black text-xs font-black rounded-full shadow-xl uppercase tracking-widest mb-6 inline-block">
              {event.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">{event.title}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="w-12 h-12 bg-[#FFB800]/20 rounded-xl flex items-center justify-center text-[#FFB800]">
                  <FiCalendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Date & Time</p>
                  <p className="text-white font-bold">
                    {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  {(event.startTime || event.endTime) && (
                    <p className="text-gray-400 text-xs font-bold mt-1">
                      {event.startTime} {event.endTime && `- ${event.endTime}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="w-12 h-12 bg-[#FFB800]/20 rounded-xl flex items-center justify-center text-[#FFB800]">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Venue</p>
                  <p className="text-white font-bold">{event.venue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailHeader;
