'use client';
import React, { useState, useEffect } from 'react';
import BentoGallery from './BentoGallery';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

const GalleryPreview = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await api.get('/gallery?limit=10');
                setItems(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (loading || items.length === 0) return null;

    return (
        <section className="bg-black py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter">
                            Captured <span className="text-[#FFB800]">Moments.</span>
                        </h2>
                        <p className="text-gray-400 font-medium text-lg">A glimpse into the vibrant ecosystem of E-Cell IIIT Trichy.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/gallery" className="inline-block px-8 py-4 bg-white/5 hover:bg-[#FFB800] text-white hover:text-black border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
                            Explore All Media
                        </Link>
                    </motion.div>
                </div>
                <BentoGallery items={items} />
            </div>
        </section>
    );
};

export default GalleryPreview;
