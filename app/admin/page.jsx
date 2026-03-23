'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import DashboardStatsGrid from '@/components/admin/dashboard/DashboardStatsGrid';
import LiveActivityFeed from '@/components/admin/dashboard/LiveActivityFeed';
import QuickActionsSidebar from '@/components/admin/dashboard/QuickActionsSidebar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeTeam: 0,
    newMessages: 0,
    latestEvent: null,
    latestMessage: null
  });
  const [loading, setLoading] = useState(true);

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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-3">
            Admin <span className="text-[#FFB800]">Control Center</span>
          </h1>
        </div>
      </motion.div>

      <DashboardStatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <LiveActivityFeed stats={stats} />
        <QuickActionsSidebar />
      </div>
    </div>
  );
}
