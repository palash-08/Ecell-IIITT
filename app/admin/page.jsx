'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiMail, FiArrowUpRight, FiActivity, FiTrendingUp } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeTeam: 0,
    newMessages: 0,
    totalRegistrations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, teamRes, contactRes, regRes] = await Promise.all([
          api.get('/events'),
          api.get('/team'),
          api.get('/contact'),
          api.get('/registrations')
        ]);

        setStats({
          totalEvents: eventsRes.data.data.length,
          activeTeam: teamRes.data.data.filter(m => m.active).length,
          newMessages: contactRes.data.data.length,
          totalRegistrations: regRes.data.data.length
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Events', value: stats.totalEvents, icon: <FiCalendar />, color: 'bg-blue-50 text-blue-600', link: '/admin/events' },
    { title: 'Active Team', value: stats.activeTeam, icon: <FiUsers />, color: 'bg-green-50 text-green-600', link: '/admin/team' },
    { title: 'New Messages', value: stats.newMessages, icon: <FiMail />, color: 'bg-purple-50 text-purple-600', link: '/admin' }, // Contact management to be added if needed
    { title: 'Registrations', value: stats.totalRegistrations, icon: <FiActivity />, color: 'bg-amber-50 text-[#FFB800]', link: '/admin/events' },
  ];

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[400px]">
           <div className="w-10 h-10 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
        </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-black mb-2">Welcome back, Admin!</h1>
        <p className="text-gray-500 font-medium text-lg">Here's what's happening with E-Cell IIIT Trichy today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.color}`}>
                {React.cloneElement(card.icon, { size: 24 })}
              </div>
              <Link href={card.link} className="text-gray-300 hover:text-black transition-colors">
                <FiArrowUpRight size={20} />
              </Link>
            </div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">{card.title}</p>
            <h3 className="text-3xl font-black text-black">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-black flex items-center gap-3">
               <FiTrendingUp className="text-[#FFB800]" /> Recent Activity
            </h3>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">Live Stats</span>
          </div>
          
          <div className="space-y-8">
             <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <FiCalendar className="text-blue-500" />
                   </div>
                   <div>
                      <p className="font-bold text-black">Latest Event</p>
                      <p className="text-sm text-gray-500">Events are up to date</p>
                   </div>
                </div>
                <Link href="/admin/events" className="text-xs font-extrabold text-[#FFB800] uppercase tracking-widest hover:underline">Manage</Link>
             </div>

             <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <FiUsers className="text-green-500" />
                   </div>
                   <div>
                      <p className="font-bold text-black">Team Pulse</p>
                      <p className="text-sm text-gray-500">{stats.activeTeam} core members active</p>
                   </div>
                </div>
                <Link href="/admin/team" className="text-xs font-extrabold text-[#FFB800] uppercase tracking-widest hover:underline">View Team</Link>
             </div>
          </div>
        </div>

        <div className="bg-black rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800] rounded-full blur-[80px] opacity-20"></div>
          <h3 className="text-2xl font-black text-white mb-6">Quick Actions</h3>
          <div className="space-y-4 relative z-10">
            <Link href="/admin/events/create" className="flex items-center justify-between w-full bg-white/10 border border-white/10 p-5 rounded-2xl text-white font-bold hover:bg-[#FFB800] hover:text-black transition-all group no-underline">
              Create New Event
              <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/admin/team/add" className="flex items-center justify-between w-full bg-white/10 border border-white/10 p-5 rounded-2xl text-white font-bold hover:bg-[#FFB800] hover:text-black transition-all group no-underline">
              Add Team Member
              <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/admin/alumni" className="flex items-center justify-between w-full bg-white/10 border border-white/10 p-5 rounded-2xl text-white font-bold hover:bg-[#FFB800] hover:text-black transition-all group no-underline">
              Export Alumni List
              <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
