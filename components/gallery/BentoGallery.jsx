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
            'col-span-2 row-span-2 md:col-span-2 md:row-span-2', // Big square
            'col-span-1 row-span-1 md:col-span-1 md:row-span-1', // Small
            'col-span-1 row-span-1 md:col-span-1 md:row-span-2', // Tall on MD+
            'col-span-1 row-span-1 md:col-span-1 md:row-span-1', // Small
            'col-span-2 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-1', // Wide -> Small on LG
            'col-span-1 row-span-1 md:col-span-1 md:row-span-1', // Small
            'col-span-1 row-span-1 md:col-span-1 md:row-span-1', // Small
            'col-span-2 row-span-1 md:col-span-1 md:row-span-1', // Wide on Mobile -> Small on MD+
        ];
        return patterns[index % patterns.length];
    };

    if (!items || items.length === 0) return null;

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
                {items.map((item, idx) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        onClick={() => handleSelect(item)}
                        className={`${getGridClass(idx)} relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-black shadow-2xl active:scale-95 transition-transform duration-200`}
                    >
                        {item.mediaType === 'image' ? (
                            <div className="w-full h-full relative overflow-hidden">
                                <img 
                                    src={`${API_URL}${item.url}`} 
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
                                />
                                <img 
                                    src={`${API_URL}${item.url}`} 
                                    alt={item.title}
                                    className="relative w-full h-full object-contain transition-transform duration-700 md:group-hover:scale-105 opacity-90 group-hover:opacity-100 p-2 md:p-4"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                                <video 
                                    src={`${API_URL}${item.url}`} 
                                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                                    muted
                                    preload="metadata"
                                />
                                <video 
                                    src={`${API_URL}${item.url}`} 
                                    className="relative w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                                    muted
                                    preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FiVideo className="text-white/50 group-hover:text-[#FFB800] transition-colors" size={24} />
                                </div>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-90 transition-opacity"></div>
                        
                        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 md:translate-y-4 md:group-hover:translate-y-0 transition-transform">
                            <p className="text-[#FFB800] text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                {item.category}
                            </p>
                            <h3 className="text-white font-black text-sm md:text-lg leading-tight line-clamp-2">
                                {item.title}
                            </h3>
                            <div className="mt-2 md:mt-4 flex justify-end opacity-0 md:group-hover:opacity-100 transition-opacity">
                                 <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FFB800] rounded-lg md:rounded-xl flex items-center justify-center text-black shadow-lg">
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
                    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-2 md:p-10">
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
                                className="absolute -top-10 right-2 md:-top-12 md:-right-12 text-white hover:text-[#FFB800] transition-colors z-10"
                            >
                                <FiX size={32} />
                            </button>
                            
                            <div className="bg-black rounded-2xl md:rounded-[2rem] overflow-hidden flex items-center justify-center aspect-square sm:aspect-auto sm:max-h-[70vh] relative shadow-2xl">
                                {selectedMedia.mediaType === 'image' ? (
                                    <>
                                        <img 
                                            src={`${API_URL}${selectedMedia.url}`} 
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30"
                                        />
                                        <img 
                                            src={`${API_URL}${selectedMedia.url}`} 
                                            alt={selectedMedia.title}
                                            className="relative max-w-full max-h-[70vh] object-contain shadow-2xl p-4"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <video 
                                            src={`${API_URL}${selectedMedia.url}`} 
                                            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30"
                                        />
                                        <video 
                                            src={`${API_URL}${selectedMedia.url}`}
                                            controls
                                            autoPlay
                                            className="relative max-w-full max-h-[70vh] object-contain shadow-2xl"
                                        />
                                    </>
                                )}
                            </div>
                            
                            <div className="mt-4 md:mt-8 text-center text-white p-4">
                                <span className="text-[#FFB800] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4 block text-center">
                                    {selectedMedia.category}
                                </span>
                                <h3 className="text-xl md:text-5xl font-black tracking-tighter mb-2 line-clamp-2">{selectedMedia.title}</h3>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BentoGallery;
