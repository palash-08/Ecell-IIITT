"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

const FeaturedEvents = () => {
  const events = [
    {
      id: "e-summit-2025",
      title: "E-Summit 2025",
      date: "Mar 15, 2025",
      image: "/meeting.jpg",
      category: "Flagship",
    },
    {
      id: "ideathon-2024",
      title: "Ideathon 2024",
      date: "Oct 10, 2024",
      image: "/meeting.jpg",
      category: "Hackathon",
    },
    {
      id: "startup-talk",
      title: "Startup Talk",
      date: "Aug 20, 2024",
      image: "/meeting.jpg",
      category: "Seminar",
    },
  ];

  return (
    <section className="py-24 px-6 relative bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4 tracking-tight">
              Featured <span className="text-[#FFB800]">Events</span>
            </h2>
            <p className="text-gray-600 font-medium text-lg">
              Discover what's happening at E-Cell IIIT Trichy.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden md:inline-flex text-[#1A1A1A] font-bold hover:text-[#FFB800] transition-colors"
          >
            View All Events &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute inset-0 z-0 h-3/5">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute top-4 left-4 z-20">
                <span className="inline-block px-4 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-black border border-gray-100 shadow-sm">
                  {event.category}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 bg-white z-10 border-t border-gray-100 min-h-[40%] flex flex-col justify-end">
                <h3 className="text-2xl font-extrabold text-black mb-2 group-hover:text-[#FFB800] transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-500 font-semibold">{event.date}</p>
              </div>

              <div className="absolute inset-0 z-10 border-2 border-transparent group-hover:border-[#FFB800] rounded-3xl transition-colors pointer-events-none" />

              <Link
                href={`/events/${event.id}`}
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
            className="inline-flex px-8 py-4 border-2 border-black rounded-full text-black font-bold hover:bg-black hover:text-white transition-colors"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
