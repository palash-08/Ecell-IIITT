'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { FiCalendar, FiMapPin, FiFileText, FiX, FiCheckCircle, FiChevronRight, FiGrid } from 'react-icons/fi';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';

export default function MyRegistrationsPage() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReg, setSelectedReg] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const regRes = await api.get('/registrations/my');
                setRegistrations(regRes.data.data);
            } catch (err) {
                console.error('Error fetching registrations:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchRegistrations();
    }, [user]);

    const renderSubmissionDetails = (formData) => {
        return Object.entries(formData).map(([key, value]) => {
            const isFile = typeof value === 'string' && value.startsWith('/uploads/');
            return (
                <div key={key} className="border-b border-gray-50 py-4 last:border-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{key}</p>
                    {isFile ? (
                        <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${value}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#FFB800] font-bold text-sm hover:underline flex items-center gap-2"
                        >
                            View Attachment <FiChevronRight />
                        </a>
                    ) : (
                        <p className="text-black font-semibold">{Array.isArray(value) ? value.join(', ') : value}</p>
                    )}
                </div>
            );
        });
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-white pt-[120px] pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-6xl font-black text-black mb-4">My <span className="text-[#FFB800]">Registrations.</span></h1>
                        <p className="text-gray-500 font-medium text-lg italic">View the events you&apos;ve registered for and your submissions.</p>
                    </header>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : registrations.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-12 text-center">
                            <FiCalendar className="mx-auto text-gray-300 mb-6" size={48} />
                            <h3 className="text-2xl font-black text-black mb-2">No Registrations Yet</h3>
                            <p className="text-gray-500 font-medium mb-8">You haven&apos;t registered for any events. Explore our events and join the ecosystem!</p>
                            <Link href="/events" className="inline-block bg-black text-white font-black py-4 px-10 rounded-2xl hover:bg-[#FFB800] hover:text-black transition-all uppercase tracking-widest text-sm shadow-xl">
                                Browse Events
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {registrations.map((reg) => (
                                <div key={reg._id} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all group">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 bg-[#FFB800]/10 text-[#FFB800] text-[10px] font-black rounded-full uppercase tracking-widest">
                                                    {reg.event?.category || 'Event'}
                                                </span>
                                                <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">
                                                    Submitted: {new Date(reg.submittedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-black group-hover:text-[#FFB800] transition-colors mb-4">{reg.event?.title}</h3>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                                                    <FiCalendar />
                                                    {new Date(reg.event?.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                                                    <FiMapPin />
                                                    {reg.event?.venue || 'Online / IIIT Trichy'}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="md:border-l border-gray-50 md:pl-8 flex flex-col justify-center">
                                            <button 
                                                onClick={() => setSelectedReg(reg)}
                                                className="flex items-center gap-2 text-black font-black uppercase tracking-widest text-xs hover:text-[#FFB800] transition-colors group/btn"
                                            >
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover/btn:bg-[#FFB800]/10 transition-colors">
                                                    <FiFileText size={18} />
                                                </div>
                                                View Submission
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Submission Details Modal */}
            <AnimatePresence>
                {selectedReg && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedReg(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="bg-black p-8 text-white relative">
                                <button 
                                    onClick={() => setSelectedReg(null)}
                                    className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors"
                                >
                                    <FiX size={24} />
                                </button>
                                <span className="px-3 py-1 bg-[#FFB800] text-black text-[10px] font-black rounded-full uppercase tracking-widest mb-4 inline-block">
                                    Registration Details
                                </span>
                                <h3 className="text-3xl font-black pr-12">{selectedReg.event?.title}</h3>
                            </div>
                            
                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-2 mb-8 bg-gray-50 p-6 rounded-2xl">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                        <FiCalendar /> Submited on {new Date(selectedReg.submittedAt).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                        <FiCheckCircle className="text-green-500" /> Status: Confirmed
                                    </div>
                                </div>
                                
                                <h4 className="text-sm font-black text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FiGrid className="text-[#FFB800]" /> Form Submissions
                                </h4>
                                
                                <div className="space-y-1">
                                    {renderSubmissionDetails(selectedReg.formData)}
                                </div>
                            </div>
                            
                            <div className="p-8 pt-0">
                                <button 
                                    onClick={() => setSelectedReg(null)}
                                    className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-[#FFB800] hover:text-black transition-all uppercase tracking-widest text-sm"
                                >
                                    Close Window
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ProtectedRoute>
    );
}
