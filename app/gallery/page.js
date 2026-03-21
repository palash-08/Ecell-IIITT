'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiVideo, FiMaximize2, FiX, FiCalendar, FiTag } from 'react-icons/fi';
import Image from 'next/image';
import api from '@/lib/api';

export default function GalleryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedMedia, setSelectedMedia] = useState(null);

    const categories = ['All', 'Flagship', 'Hackathon', 'Workshop', 'Seminar', 'Other'];

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await api.get('/gallery');
                setItems(res.data.data);
            } catch (err) {
                console.error('Error fetching gallery:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const filteredItems = filter === 'All' 
        ? items 
        : items.filter(item => item.category === filter);

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/api$/, '');

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-20 text-center">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#FFB800] font-black uppercase tracking-[0.3em] text-sm mb-4 block"
                >
                    Visual Journey
                </motion.span>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-black text-black mb-8 tracking-tighter"
                >
                    Our <span className="text-gray-200">Gallery.</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto text-gray-500 font-medium text-lg leading-relaxed"
                >
                    A collection of moments, milestones, and memories from our most iconic events and initiatives.
                </motion.p>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto mb-12 overflow-x-auto">
                <div className="flex justify-center items-center gap-4 min-w-max pb-4">
                    {categories.map((cat, idx) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                                filter === cat 
                                ? 'bg-[#FFB800] text-black shadow-lg shadow-[#FFB800]/20' 
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[4/3] bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-40">
                        <p className="text-gray-400 font-black text-xl uppercase tracking-widest">No media available in this category</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                layout
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-gray-100 bg-gray-50"
                                onClick={() => setSelectedMedia(item)}
                            >
                                {item.mediaType === 'image' ? (
                                    <Image 
                                        src={`${API_URL}${item.url}`} 
                                        alt={item.title}
                                        width={800}
                                        height={600}
                                        unoptimized
                                        className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="relative group">
                                        <video 
                                            src={`${API_URL}${item.url}`}
                                            className="w-full h-auto"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                                <FiVideo className="text-white" size={24} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 text-white">
                                    <span className="text-[#FFB800] font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FiTag size={10} /> {item.category}
                                    </span>
                                    <h3 className="text-xl font-black mb-2 line-clamp-2">{item.title}</h3>
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-300">
                                        <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(item.date).toLocaleDateString()}</span>
                                        <FiMaximize2 className="ml-auto" size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox / Preview Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMedia(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        ></motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-6xl max-h-full flex flex-col"
                        >
                            <button 
                                onClick={() => setSelectedMedia(null)}
                                className="absolute -top-12 right-0 md:-right-12 text-white hover:text-[#FFB800] transition-colors"
                            >
                                <FiX size={32} />
                            </button>
                            
                            <div className="bg-black rounded-[3rem] overflow-hidden flex items-center justify-center aspect-video sm:aspect-auto sm:max-h-[80vh]">
                                {selectedMedia.mediaType === 'image' ? (
                                    <Image 
                                        src={`${API_URL}${selectedMedia.url}`} 
                                        alt={selectedMedia.title}
                                        width={1200}
                                        height={800}
                                        unoptimized
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <video 
                                        src={`${API_URL}${selectedMedia.url}`}
                                        controls
                                        autoPlay
                                        className="max-w-full max-h-full"
                                    />
                                )}
                            </div>
                            
                            <div className="mt-8 text-center text-white p-4">
                                <span className="text-[#FFB800] font-black text-xs uppercase tracking-[0.3em] mb-4 block">
                                    {selectedMedia.category} • {new Date(selectedMedia.date).toLocaleDateString()}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{selectedMedia.title}</h3>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
