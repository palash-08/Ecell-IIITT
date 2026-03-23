import React from "react";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiArrowRight, FiClock } from "react-icons/fi";

const EventCard = ({ event }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCompleted = event.status === "Completed" || eventDate < today;
  const displayStatus = isCompleted ? "Completed" : "Upcoming";

  return (
    <Link
      href={`/events/${event._id}`}
      className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full no-underline"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            event.mainImage ? `${API_URL}${event.mainImage}` : "/Ecell-logo.png"
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-black text-[10px] font-black rounded-full shadow-xl uppercase tracking-[0.2em] border border-white/50">
            {event.category}
          </span>
          <span
            className={`px-4 py-1.5 backdrop-blur-md text-white text-[10px] font-black rounded-full shadow-xl uppercase tracking-[0.2em] border border-white/20 ${!isCompleted ? "bg-amber-500/80" : "bg-green-500/80"}`}
          >
            {displayStatus}
          </span>
        </div>
      </div>

      <div className="p-10 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-black mb-6 line-clamp-2 leading-tight group-hover:text-[#FFB800] transition-colors">
          {event.title.replace("Workshopon", "Workshop on")}
        </h3>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8">
          <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <FiCalendar size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 font-black">Date</span>
              <span className="text-gray-700">
                {new Date(event.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <FiClock size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 font-black">Time</span>
              <span className="text-gray-700">{event.startTime || "TBD"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest col-span-2 mt-1">
            <div className="w-8 h-8 min-w-[32px] rounded-lg bg-gray-50 flex items-center justify-center text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <FiMapPin size={14} />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-gray-400 font-black">Venue</span>
              <span className="text-gray-700 truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-400 font-medium mb-10 line-clamp-2 leading-relaxed text-sm">
          {event.description}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center group/btn">
          <span className="flex items-center gap-2 text-black font-black uppercase tracking-[0.2em] text-[10px] group-hover:text-[#FFB800] transition-colors">
            View Details{" "}
            <FiArrowRight className="text-[#FFB800] group-hover/btn:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
