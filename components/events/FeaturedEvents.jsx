"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import api from "@/lib/api";
import { FiCalendar, FiArrowRight } from "react-icons/fi";

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        // Get top 3 upcoming or most recent events
        const sortedEvents = res.data.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setEvents(sortedEvents);
      } catch (err) {
        console.error('Error fetching featured events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/api$/, '');

  if (loading || events.length === 0) return null;

  return (
    <section className="py-24 px-6 relative bg-[#W5W5W5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4 tracking-tight">
              Latest <span className="text-[#FFB800]">Events</span>
            </h2>
            <p className="text-gray-600 font-medium text-lg">
              Discover what's happening at E-Cell IIIT Trichy.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden md:inline-flex items-center gap-2 text-[#1A1A1A] font-bold hover:text-[#FFB800] transition-colors"
          >
            View All Events <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute inset-0 z-0 h-3/5">
                <img
                  src={event.mainImage ? `${API_URL}${event.mainImage}` : "/Ecelllogo.jpeg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-4 left-4 z-20">
                <span className="inline-block px-4 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-black border border-gray-100 shadow-sm">
                  {event.category}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 bg-white z-10 border-t border-gray-100 min-h-[40%] flex flex-col justify-end">
                <h3 className="text-2xl font-extrabold text-black mb-2 group-hover:text-[#FFB800] transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 font-semibold">
                    <FiCalendar className="text-[#FFB800]" />
                    {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="absolute inset-0 z-10 border-2 border-transparent group-hover:border-[#FFB800] rounded-3xl transition-colors pointer-events-none" />

              <Link
                href={`/events/${event._id}`}
                className="absolute inset-0 z-20"
              >
                <span className="sr-only">View Event</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/events"
            className="inline-flex px-8 py-4 border-2 border-black rounded-full text-black font-bold hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-xs"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
