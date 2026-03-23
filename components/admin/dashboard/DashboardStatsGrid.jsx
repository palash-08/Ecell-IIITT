import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCalendar, FiUsers, FiMail, FiArrowUpRight } from 'react-icons/fi';

export default function DashboardStatsGrid({ stats }) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {statCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group relative"
        >
          <Link href={card.link} className="block no-underline">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 overflow-hidden h-full">
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
  );
}
