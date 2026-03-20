"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";

const EventCard = ({ event, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative flex flex-col md:flex-row bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-[#FFB800] hover:shadow-xl transition-all duration-300"
        >
            <div className="relative w-full md:w-1/3 h-56 md:h-auto overflow-hidden">
                <Image
                    src={event.image || "/Ecelllogo.jpeg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 left-4 bg-[#FFB800] text-black text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    {event.status || "Event"}
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-3xl font-extrabold text-black mb-3 group-hover:text-[#FFB800] transition-colors tracking-tight">
                        {event.title}
                    </h3>
                    <p className="text-gray-600 font-medium mb-6 line-clamp-3 leading-relaxed">
                        {event.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-gray-700 font-medium mb-6">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-[#FFB800] text-lg" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-[#FFB800] text-lg" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>

                {event.link && (
                    <a
                        href={event.link}
                        className="inline-flex items-center gap-2 text-black hover:text-[#FFB800] font-bold transition-colors w-max"
                    >
                        Learn More <FaExternalLinkAlt size={14} />
                    </a>
                )}
            </div>
        </motion.div>
    );
};

const EventList = ({ title, events }) => {
    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-extrabold text-black mb-12 tracking-tight flex items-center gap-4"
                >
                    <div className="w-2 h-10 bg-[#FFB800] rounded-full"></div>
                    {title}
                </motion.h2>
                <div className="flex flex-col gap-10">
                    {events.map((event, index) => (
                        <EventCard key={index} event={event} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventList;
