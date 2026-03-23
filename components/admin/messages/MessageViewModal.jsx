import React from 'react';
import { FiX, FiMail, FiUser, FiCalendar, FiTrash2 } from 'react-icons/fi';

export default function MessageViewModal({ selectedMessage, setSelectedMessage, deleteMessage, formatDate }) {
  if (!selectedMessage) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-black p-8 text-white relative">
          <button 
            onClick={() => setSelectedMessage(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-[#FFB800] transition-colors cursor-pointer"
          >
            <FiX size={28} />
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#FFB800] rounded-2xl flex items-center justify-center text-black">
              <FiMail size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Message Details</h3>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-bold text-white/60">
            <div className="flex items-center gap-2"><FiUser className="text-[#FFB800]" /> {selectedMessage.name}</div>
            <div className="flex items-center gap-2"><FiMail className="text-[#FFB800]" /> {selectedMessage.email}</div>
            <div className="flex items-center gap-2"><FiCalendar className="text-[#FFB800]" /> {formatDate(selectedMessage.createdAt)}</div>
          </div>
        </div>
        
        <div className="p-10">
          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-gray-700 text-lg leading-relaxed font-medium whitespace-pre-wrap italic">
            "{selectedMessage.message}"
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Regarding your inquiry at E-Cell IIIT Trichy`;
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FFB800] text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#e6a700] transition-all cursor-pointer"
              >
                Reply via Email
              </button>
              <button 
                onClick={() => deleteMessage(selectedMessage._id)}
                className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all border border-red-100 cursor-pointer"
              >
                <FiTrash2 size={18} />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
