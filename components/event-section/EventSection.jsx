import React from "react";
import { FaClock, FaMapMarkerAlt, FaTrophy, FaLightbulb, FaHandshake } from "react-icons/fa";

const upcomingEvents = [
  {
    day: "15",
    month: "Feb",
    title: "Startup Pitch Competition",
    description: "Present your innovative ideas to industry experts and win exciting prizes.",
    time: "10:00 AM",
    location: "Auditorium",
  },
  {
    day: "22",
    month: "Feb",
    title: "Entrepreneurship Workshop",
    description: "Learn the fundamentals of starting and scaling a successful business.",
    time: "2:00 PM",
    location: "Seminar Hall",
  },
  {
    day: "05",
    month: "Mar",
    title: "Investor Connect",
    description: "Network with angel investors and VCs looking for promising startups.",
    time: "11:00 AM",
    location: "Conference Room",
  },
];

const pastEvents = [
  {
    icon: <FaTrophy />,
    title: "E-Summit 2024",
    description: "Our flagship annual event with 500+ participants, 20+ speakers, and startup exhibitions.",
    stats: ["500+ Participants", "20+ Speakers"],
  },
  {
    icon: <FaLightbulb />,
    title: "Innovation Challenge",
    description: "48-hour hackathon focusing on solving real-world problems through technology.",
    stats: ["100+ Teams", "₹2L Prize Pool"],
  },
  {
    icon: <FaHandshake />,
    title: "Mentor Meet",
    description: "Exclusive session with successful entrepreneurs sharing their journey and insights.",
    stats: ["15+ Mentors", "200+ Students"],
  },
];

const EventSection = () => {
  return (
    <section id="events" className="py-24 bg-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-center mb-16 relative inline-block section-title">
          Events
        </h2>

        {/* Upcoming Events */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-[#2c3e50] mb-8 text-center">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition transform flex gap-5"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-xl text-center w-20 flex-shrink-0">
                  <span className="block text-2xl font-bold">{event.day}</span>
                  <span className="block text-sm">{event.month}</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-[#2c3e50] mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-700">{event.description}</p>
                  <div className="flex gap-4 mt-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaClock /> {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt /> {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h3 className="text-2xl font-bold text-[#2c3e50] mb-8 text-center">Past Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg text-center flex flex-col items-center hover:-translate-y-1 transition transform"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl mb-4">
                  {event.icon}
                </div>
                <h4 className="text-xl font-semibold text-[#2c3e50] mb-2">{event.title}</h4>
                <p className="text-sm text-gray-700">{event.description}</p>
                <div className="flex gap-3 mt-4 flex-wrap justify-center">
                  {event.stats.map((stat, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventSection;
