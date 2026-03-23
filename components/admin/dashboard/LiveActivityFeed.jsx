import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiActivity, FiArrowRight, FiCalendar, FiMail } from 'react-icons/fi';

export default function LiveActivityFeed({ stats }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-2 bg-white border border-gray-100 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm"
    >
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <h3 className="text-2xl font-black text-black flex items-center gap-4">
           <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-[#FFB800]">
             <FiActivity size={20} />
           </div>
           Live Activity
        </h3>
        <Link href="/admin/events" className="text-xs font-black text-[#FFB800] uppercase tracking-[0.2em] hover:underline">Full Report</Link>
      </div>

      <div className="space-y-6">
        {stats.latestEvent ? (
          <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 hover:bg-black rounded-3xl border border-transparent hover:border-black transition-all duration-300">
            <div className="w-full sm:w-20 h-40 sm:h-20 rounded-2xl bg-white overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-95">
              {stats.latestEvent.mainImage ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${stats.latestEvent.mainImage}`} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FiCalendar size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest bg-amber-50 group-hover:bg-amber-100/10 px-2 py-0.5 rounded flex-shrink-0">Latest Event</span>
                <span className="text-[10px] font-bold text-gray-400 italic truncate">Recently added</span>
              </div>
              <h4 className="text-lg font-black text-black group-hover:text-white truncate w-full">{stats.latestEvent.title}</h4>
              <p className="text-sm text-gray-500 group-hover:text-gray-400 flex items-center gap-2 w-full">
                <FiArrowRight size={14} className="text-[#FFB800] shrink-0" />
                <span className="truncate">{stats.latestEvent.category} • {stats.latestEvent.venue}</span>
              </p>
            </div>
            <Link href={`/admin/events/${stats.latestEvent._id}`} className="w-10 h-10 bg-white group-hover:bg-[#FFB800] rounded-xl flex items-center justify-center text-black shadow-sm transition-colors opacity-0 group-hover:opacity-100 self-end sm:self-center">
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Recent Event Data</p>
          </div>
        )}

        {stats.latestMessage && (
           <div className="group relative flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white border border-gray-100 hover:border-black hover:bg-black rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 group-hover:bg-amber-100/10 text-[#FFB800] rounded-2xl flex items-center justify-center flex-shrink-0">
                 <FiMail size={24} />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 sm:gap-3 mb-1">
                    <p className="text-sm font-black text-black group-hover:text-white truncate">{stats.latestMessage.name}</p>
                    <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full shrink-0"></span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">New Hook</p>
                 </div>
                 <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-400 truncate italic">"{stats.latestMessage.message}"</p>
              </div>
              <Link href="/admin/messages" className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest opacity-0 group-hover:opacity-100 hover:underline before:absolute before:inset-0">Reply</Link>
           </div>
        )}
      </div>
    </motion.div>
  );
}
