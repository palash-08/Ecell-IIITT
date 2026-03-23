import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers, FiArrowRight, FiZap } from 'react-icons/fi';

export default function QuickActionsSidebar() {
  const quickActions = [
    { label: 'Create Event', icon: <FiPlus />, href: '/admin/events/create', color: 'bg-black text-white' },
    { label: 'Add Member', icon: <FiUsers />, href: '/admin/team/add', color: 'bg-white border border-gray-100' },
    { label: 'Gallery Upload', icon: <FiPlus />, href: '/admin/gallery', color: 'bg-white border border-gray-100' },
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-black rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden h-fit"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800] rounded-full blur-[80px] opacity-20 scale-150 animate-pulse"></div>
        
        <div className="flex items-center gap-4 mb-8 md:mb-10 relative z-10">
           <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#FFB800]">
              <FiZap size={20} />
           </div>
           <h3 className="text-xl md:text-2xl font-black text-white">Quick Actions</h3>
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
  );
}
