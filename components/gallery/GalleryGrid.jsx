"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

const GalleryGrid = ({ images }) => {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-extrabold text-black mb-12 tracking-tight flex items-center gap-4"
                >
                    <div className="w-2 h-10 bg-[#FFB800] rounded-full"></div>
                    Event Gallery
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className={`relative overflow-hidden rounded-2xl group border border-gray-200 shadow-sm hover:shadow-xl transition-shadow ${index % 3 === 0 ? "md:col-span-2 md:row-span-2 aspect-video" : "aspect-square"
                                }`}
                        >
                            <Image
                                src={src}
                                alt={`Gallery Image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-[#FFB800]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GalleryGrid;
