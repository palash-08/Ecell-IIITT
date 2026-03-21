'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FiSend, FiMail, FiPhone, FiMapPin, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      <div className="bg-black py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight">Get in <span className="text-[#FFB800]">Touch.</span></h1>
            <p className="text-xl text-gray-400 font-medium mb-12 max-w-lg leading-relaxed">
              Have an idea, a question, or want to collaborate? Reach out to us — we’re always open to connecting, learning, and building together.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#FFB800]/10 rounded-2xl flex items-center justify-center text-[#FFB800] border border-[#FFB800]/20">
                  <FiMail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Reach us at</p>
                  <p className="text-white font-bold text-lg">ecell@iiitt.ac.in</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#FFB800]/10 rounded-2xl flex items-center justify-center text-[#FFB800] border border-[#FFB800]/20">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Based in</p>
                  <p className="text-white font-bold text-lg">IIIT Trichy, Sethurappatti, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative"
          >
            {success ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <FiCheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tight">Message Sent!</h2>
                <p className="text-gray-500 font-medium mb-8 text-lg">Thanks for reaching out! Our team will get back to you as soon as possible.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-[#FFB800] hover:text-black transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g.  Rahul Gupta"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Message</label>
                  <textarea 
                    rows={5} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us how we can help or collaborate..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black resize-none"
                  ></textarea>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 p-4 rounded-2xl border border-red-100">
                    <FiAlertCircle size={18} />
                    <p>{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#FFB800] hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : <><FiSend /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
