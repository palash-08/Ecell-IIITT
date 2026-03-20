import React from 'react';
import { motion } from 'motion/react';
import { FiLinkedin, FiMail, FiUser, FiBriefcase, FiCheckCircle } from 'react-icons/fi';

const MemberCard = ({ member, variant = 'team' }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  if (variant === 'alumni') {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 group"
      >
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-sm transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
            {member.image ? (
              <img src={`${API_URL}${member.image}`} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <FiUser size={32} />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-black text-black mb-1 tracking-tight group-hover:text-[#FFB800] transition-colors">{member.name}</h3>
            <p className="text-[#FFB800] font-black text-xs uppercase tracking-[0.2em]">Batch of {member.batch || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-700 font-bold">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
              <FiBriefcase size={16} />
            </div>
            {member.role} {member.company && <><span className="text-gray-300">@</span> {member.company}</>}
          </div>
          {member.formerPosition && (
            <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] transition-colors">
                <FiCheckCircle size={14} />
              </div>
              Was {member.formerPosition}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">IIIT TRICHY E-CELL</span>
          <div className="flex gap-2">
            {member.email && (
              <a href={`mailto:${member.email}`} className="w-10 h-10 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center hover:bg-[#FFB800] hover:text-black transition-all" title={member.email}>
                <FiMail size={18} />
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#FFB800] hover:text-black transition-all shadow-lg">
                <FiLinkedin size={14} /> CONNECT
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default 'team' variant
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 relative">
        {member.image ? (
          <img src={`${API_URL}${member.image}`} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <FiUser size={80} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-[#FFB800] hover:text-black transition-all">
              <FiLinkedin size={20} />
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#FFB800] transition-all">
              <FiMail size={20} />
            </a>
          )}
        </div>
      </div>
      <h3 className="text-xl font-black text-black mb-1 text-center group-hover:text-[#FFB800] transition-colors">{member.name}</h3>
      <p className="text-gray-500 font-bold text-sm text-center uppercase tracking-widest">{member.role}</p>
    </motion.div>
  );
};

export default MemberCard;
