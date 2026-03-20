import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMaximize2, FiVideo, FiX } from 'react-icons/fi';

const BentoGallery = ({ items = [], onSelect }) => {
    const [selectedMedia, setSelectedMedia] = useState(null);
    const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/api$/, '');

    const handleSelect = (item) => {
        if (onSelect) {
            onSelect(item);
        } else {
            setSelectedMedia(item);
        }
    };

    // Define different layout patterns based on index
    const getGridClass = (index) => {
        const patterns = [
            'md:col-span-2 md:row-span-2', // Big square
            'md:col-span-1 md:row-span-1', // Small
            'md:col-span-1 md:row-span-2', // Vertical tall
            'md:col-span-1 md:row-span-1', // Small
            'md:col-span-2 md:row-span-1', // Horizontal wide
        ];
        return patterns[index % patterns.length];
    };

    if (!items || items.length === 0) return null;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
                {items.map((item, idx) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        onClick={() => handleSelect(item)}
                        className={`${getGridClass(idx)} relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl`}
                    >
                        {item.mediaType === 'image' ? (
                            <div className="w-full h-full relative overflow-hidden">
                                {/* Blurred Backdrop */}
                                <img 
                                    src={`${API_URL}${item.url}`} 
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
                                />
                                {/* Main Image */}
                                <img 
                                    src={`${API_URL}${item.url}`} 
                                    alt={item.title}
                                    className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 p-2"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                                {/* Blurred Backdrop Video */}
                                <video 
                                    src={`${API_URL}${item.url}`} 
                                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                                    muted
                                    preload="metadata"
                                />
                                {/* Main Video Preview */}
                                <video 
                                    src={`${API_URL}${item.url}`} 
                                    className="relative w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                                    muted
                                    preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FiVideo className="text-white/50 group-hover:text-[#FFB800] transition-colors" size={32} />
                                </div>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                        
                        <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                            <p className="text-[#FFB800] text-[10px] font-black uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.category}
                            </p>
                            <h3 className="text-white font-black text-lg leading-tight line-clamp-2">
                                {item.title}
                            </h3>
                            <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center text-black shadow-lg">
                                     <FiMaximize2 size={18} />
                                 </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Built-in Lightbox */}
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
                            
                            <div className="bg-black rounded-[2rem] overflow-hidden flex items-center justify-center aspect-video sm:aspect-auto sm:max-h-[75vh] relative shadow-2xl">
                                {selectedMedia.mediaType === 'image' ? (
                                    <>
                                        {/* Blurred Backdrop */}
                                        <img 
                                            src={`${API_URL}${selectedMedia.url}`} 
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 px-10"
                                        />
                                        {/* Main Image */}
                                        <img 
                                            src={`${API_URL}${selectedMedia.url}`} 
                                            alt={selectedMedia.title}
                                            className="relative max-w-full max-h-[75vh] object-contain shadow-2xl"
                                        />
                                    </>
                                ) : (
                                    <>
                                        {/* Blurred Backdrop */}
                                        <video 
                                            src={`${API_URL}${selectedMedia.url}`} 
                                            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30"
                                        />
                                        {/* Main Video */}
                                        <video 
                                            src={`${API_URL}${selectedMedia.url}`}
                                            controls
                                            autoPlay
                                            className="relative max-w-full max-h-[75vh] object-contain shadow-2xl"
                                        />
                                    </>
                                )}
                            </div>
                            
                            <div className="mt-8 text-center text-white p-4">
                                <span className="text-[#FFB800] font-black text-xs uppercase tracking-[0.3em] mb-4 block">
                                    {selectedMedia.category}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{selectedMedia.title}</h3>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BentoGallery;
