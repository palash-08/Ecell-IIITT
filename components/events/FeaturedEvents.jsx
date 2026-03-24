"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import api from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import { FiArrowRight, FiCalendar } from "react-icons/fi";

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        // Get top 3 upcoming or most recent events
        const sortedEvents = res.data.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setEvents(sortedEvents);
      } catch (err) {
        console.error("Error fetching featured events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading || events.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-6 relative bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A1A1A] mb-4 tracking-tighter">
              Latest <span className="text-[#FFB800]">Events</span>
            </h2>
            <p className="text-gray-600 font-medium text-lg max-w-2xl">
              Discover what's happening at E-Cell IIIT Trichy. Join us in our journey of catalyzing reformers.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-[#1A1A1A] font-bold hover:bg-[#FFB800] hover:border-[#FFB800] transition-all shadow-sm"
          >
            View All Events <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative bg-white border border-gray-100 rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="absolute inset-0 z-0 h-1/2 sm:h-3/5">
                <img
                  src={resolveImageUrl(event.mainImage)}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              <div className="absolute top-4 left-4 z-20">
                <span className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#FFB800] border border-gray-100 shadow-sm">
                  {event.category}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-white z-10 min-h-[50%] sm:min-h-[40%] flex flex-col justify-end">
                <div className="flex items-center gap-2 text-[#FFB800] font-bold text-sm mb-3">
                  <FiCalendar />
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-black mb-2 group-hover:text-[#FFB800] transition-colors line-clamp-2 leading-tight">
                  {event.title.replace("Workshopon", "Workshop on")}
                </h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {event.description || "Join us for this exciting event and enhance your entrepreneurial journey."}
                </p>
              </div>

              <div className="absolute inset-0 z-10 border-2 border-transparent group-hover:border-[#FFB800]/30 rounded-[2rem] transition-colors pointer-events-none" />

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
            className="inline-flex w-full justify-center px-8 py-4 bg-black text-[#FFB800] rounded-2xl font-black hover:bg-gray-900 transition-all uppercase tracking-widest text-xs shadow-xl"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
