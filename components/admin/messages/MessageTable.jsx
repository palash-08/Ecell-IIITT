import React from 'react';
import { FiMail, FiUser, FiExternalLink, FiTrash2 } from 'react-icons/fi';

export default function MessageTable({ messages, loading, deleteMessage, setSelectedMessage, formatDate }) {
  return (
    <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender Details</th>
              <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Preview</th>
              <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Date & Time</th>
              <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                 <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-10 h-10 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Retrieving Messages...</span>
                    </div>
                 </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                 <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <FiMail size={32} />
                      </div>
                      <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">No Inquiries Found</p>
                    </div>
                 </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 md:px-8 py-5 md:py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#FFB800] group-hover:text-black transition-all">
                        <FiUser size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-black">{msg.name}</div>
                        <div className="text-xs text-gray-400 font-bold">{msg.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-5 md:py-6">
                    <p className="text-sm text-gray-600 line-clamp-1 max-w-md font-medium">
                      {msg.message}
                    </p>
                  </td>
                  <td className="px-4 md:px-8 py-5 md:py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-black text-gray-400 uppercase">{formatDate(msg.createdAt).split(',')[0]}</span>
                      <span className="text-[10px] font-bold text-gray-300 italic">{formatDate(msg.createdAt).split(',')[1]}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-5 md:py-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedMessage(msg)}
                        className="p-2.5 text-gray-400 hover:text-[#FFB800] hover:bg-[#FFB800]/5 rounded-xl transition-all cursor-pointer"
                        title="View Message"
                      >
                        <FiExternalLink size={20} />
                      </button>
                      <button 
                        onClick={() => deleteMessage(msg._id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        title="Delete Message"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
