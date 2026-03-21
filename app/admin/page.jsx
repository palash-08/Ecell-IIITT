'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, FiUsers, FiMail, FiArrowRight, 
  FiPlus, FiCheckCircle, FiActivity, FiSearch,
  FiArrowUpRight, FiZap
} from 'react-icons/fi';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeTeam: 0,
    newMessages: 0,
    latestEvent: null,
    latestMessage: null
  });
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eventsRes, teamRes, contactRes] = await Promise.all([
          api.get('/events'),
          api.get('/team'),
          api.get('/contact')
        ]);

        const events = eventsRes.data.data;
        const messages = contactRes.data.data;

        setStats({
          totalEvents: events.length,
          activeTeam: teamRes.data.data.filter(m => m.active).length,
          newMessages: messages.length,
          latestEvent: events.length > 0 ? events[0] : null,
          latestMessage: messages.length > 0 ? messages[0] : null
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      title: 'Events', 
      value: stats.totalEvents, 
      icon: <FiCalendar />, 
      color: 'from-blue-500 to-blue-600', 
      lightColor: 'bg-blue-50 text-blue-600',
      link: '/admin/events',
    },
    { 
      title: 'Team Members', 
      value: stats.activeTeam, 
      icon: <FiUsers />, 
      color: 'from-emerald-500 to-emerald-600', 
      lightColor: 'bg-emerald-50 text-emerald-600',
      link: '/admin/team',
    },
    { 
      title: 'Inquiries', 
      value: stats.newMessages, 
      icon: <FiMail />, 
      color: 'from-amber-500 to-[#FFB800]', 
      lightColor: 'bg-amber-50 text-amber-600',
      link: '/admin/messages',
    },
  ];

  const quickActions = [
    { label: 'Create Event', icon: <FiPlus />, href: '/admin/events/create', color: 'bg-black text-white' },
    { label: 'Add Member', icon: <FiUsers />, href: '/admin/team/add', color: 'bg-white border border-gray-100' },
    { label: 'Gallery Upload', icon: <FiPlus />, href: '/admin/gallery', color: 'bg-white border border-gray-100' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#FFB800]/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Initializing Dashboard</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-3">
            Admin <span className="text-[#FFB800]">Control Center</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-gray-500 font-bold">System Status: <span className="text-emerald-600 uppercase tracking-widest text-xs">Operational</span></p>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onMouseEnter={() => setIsHovered(i)}
            onMouseLeave={() => setIsHovered(null)}
            className="group relative"
          >
            <Link href={card.link} className="block no-underline">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 overflow-hidden h-full">
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity font-bold`}></div>
                
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl ${card.lightColor} ring-4 ring-transparent group-hover:ring-white group-hover:shadow-lg transition-all`}>
                    {React.cloneElement(card.icon, { size: 28 })}
                  </div>
                  <div className="text-[#FFB800] opacity-0 group-hover:opacity-100 transition-all font-black">
                     <FiArrowUpRight size={24} />
                  </div>
                </div>

                <div>
                  <h3 className="text-5xl font-black text-black mb-1 flex items-baseline gap-2">
                    {card.value}
                    <span className="text-xs font-black text-gray-300 uppercase tracking-widest">total</span>
                  </h3>
                  <p className="text-gray-500 font-black text-sm uppercase tracking-widest">{card.title}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm"
        >
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-black text-black flex items-center gap-4">
               <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-[#FFB800]">
                 <FiActivity size={20} />
               </div>
               Live Activity
            </h3>
            <Link href="/admin/events" className="text-xs font-black text-[#FFB800] uppercase tracking-[0.2em] hover:underline">Full Report</Link>
          </div>

          <div className="space-y-6">
            {/* Latest Event Activity */}
            {stats.latestEvent ? (
              <div className="group relative flex items-center gap-6 p-6 bg-gray-50 hover:bg-black rounded-3xl border border-transparent hover:border-black transition-all duration-300">
                <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-95">
                  {stats.latestEvent.mainImage ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${stats.latestEvent.mainImage}`} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FiCalendar size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest bg-amber-50 group-hover:bg-amber-100/10 px-2 py-0.5 rounded">Latest Event</span>
                    <span className="text-[10px] font-bold text-gray-400 italic">2 mins ago</span>
                  </div>
                  <h4 className="text-lg font-black text-black group-hover:text-white truncate">{stats.latestEvent.title}</h4>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 flex items-center gap-2">
                    <FiArrowRight size={14} className="text-[#FFB800]" />
                    {stats.latestEvent.category} • {stats.latestEvent.venue}
                  </p>
                </div>
                <Link href={`/admin/events/${stats.latestEvent._id}`} className="w-10 h-10 bg-white group-hover:bg-[#FFB800] rounded-xl flex items-center justify-center text-black shadow-sm transition-colors opacity-0 group-hover:opacity-100">
                  <FiArrowRight />
                </Link>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Recent Event Data</p>
              </div>
            )}

            {/* Latest Message Activity */}
            {stats.latestMessage && (
               <div className="group relative flex items-center gap-6 p-6 bg-white border border-gray-100 hover:border-black hover:bg-black rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl">
                  <div className="w-14 h-14 bg-amber-50 group-hover:bg-amber-100/10 text-[#FFB800] rounded-2xl flex items-center justify-center flex-shrink-0">
                     <FiMail size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-black text-black group-hover:text-white">{stats.latestMessage.name}</p>
                        <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full"></span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Hook</p>
                     </div>
                     <p className="text-sm text-gray-500 group-hover:text-gray-400 truncate italic">"{stats.latestMessage.message}"</p>
                  </div>
                  <Link href="/admin/messages" className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest opacity-0 group-hover:opacity-100 hover:underline">Reply</Link>
               </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black rounded-[3rem] p-10 shadow-2xl relative overflow-hidden h-fit"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800] rounded-full blur-[80px] opacity-20 scale-150 animate-pulse"></div>
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#FFB800]">
                  <FiZap size={20} />
               </div>
               <h3 className="text-2xl font-black text-white">Quick Actions</h3>
            </div>

            <div className="space-y-4 relative z-10">
              {quickActions.map((action, i) => (
                <Link 
                  key={i}
                  href={action.href} 
                  className={`flex items-center justify-between w-full p-5 rounded-2xl font-black no-underline group transition-all duration-300 ${
                    i === 0 
                      ? 'bg-[#FFB800] text-black hover:bg-white' 
                      : 'bg-white/10 border border-white/5 text-white hover:bg-[#FFB800] hover:text-black'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {React.cloneElement(action.icon, { size: 18 })}
                    {action.label}
                  </span>
                  <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
