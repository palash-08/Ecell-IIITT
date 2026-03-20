'use client';

import React, { useState, useEffect } from 'react';
import { FiTrash2, FiRefreshCcw, FiMail, FiUser, FiCalendar, FiExternalLink, FiX } from 'react-icons/fi';
import api from '@/lib/api';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-2">Contact Inquiries</h1>
          <p className="text-gray-500 font-medium text-lg">Manage questions and messages from the community.</p>
        </div>
        <button 
          onClick={fetchMessages}
          className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-black hover:border-gray-300 transition-all shadow-sm"
          title="Refresh Messages"
        >
          <FiRefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Preview</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Date & Time</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
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
                    <td className="px-8 py-6">
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
                    <td className="px-8 py-6">
                      <p className="text-sm text-gray-600 line-clamp-1 max-w-md font-medium">
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-black text-gray-400 uppercase">{formatDate(msg.createdAt).split(',')[0]}</span>
                        <span className="text-[10px] font-bold text-gray-300 italic">{formatDate(msg.createdAt).split(',')[1]}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedMessage(msg)}
                          className="p-2.5 text-gray-400 hover:text-[#FFB800] hover:bg-[#FFB800]/5 rounded-xl transition-all"
                          title="View Message"
                        >
                          <FiExternalLink size={20} />
                        </button>
                        <button 
                          onClick={() => deleteMessage(msg._id)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-black p-8 text-white relative">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="absolute top-8 right-8 text-white/50 hover:text-[#FFB800] transition-colors"
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
                    className="flex-1 flex items-center justify-center gap-2 bg-[#FFB800] text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#e6a700] transition-all"
                  >
                    Reply via Email
                  </button>
                  <button 
                    onClick={() => deleteMessage(selectedMessage._id)}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all border border-red-100"
                  >
                    <FiTrash2 size={18} />
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
