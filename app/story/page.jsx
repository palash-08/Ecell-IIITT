"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { FaQuoteLeft } from "react-icons/fa";

const StoryPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-white text-black">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Our <span className="text-[#FFB800]">Story</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            How a group of students took the first step towards building an
            entrepreneurial culture at IIIT Trichy.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none text-gray-700"
        >
          <div className="relative w-full h-[400px] mb-12 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/meeting.jpg"
              alt="E-Cell Team"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-3xl font-bold text-black mb-6">The Beginning</h2>
          <p className="mb-8 leading-relaxed">
            E-Cell IIIT Trichy began in September 2022 with a simple realization
            while students were strong technically, there was limited exposure
            to entrepreneurship and real-world execution. A group of students
            came together with the idea of building a space where innovation
            could go beyond classrooms and turn into action. What started as a
            small initiative quickly grew into a shared vision to create an
            environment where students could explore ideas, learn, and build.
          </p>

          <h2 className="text-3xl font-bold text-black mb-6">
            Building the Foundation
          </h2>
          <p className="mb-8 leading-relaxed">
            In its early days, E-Cell focused on building awareness and
            engagement. Through events like Venture Quest, pitching sessions,
            workshops on finance and entrepreneurship, and interactive seminars,
            we began creating opportunities for students to step into the world
            of startups. Slowly, a community started forming — students who were
            curious, willing to experiment, and ready to learn beyond the
            classroom.
          </p>

          <div className="my-12 p-8 bg-[#F5F5F5] rounded-3xl border-l-4 border-[#FFB800] relative">
            <FaQuoteLeft className="text-4xl text-[#FFB800]/20 absolute top-6 left-6" />
            <p className="text-2xl font-bold text-black italic relative z-10 pl-8">
              "We’re not just encouraging startups — we’re building a mindset to
              create, adapt, and lead."
            </p>
          </div>

          <h2 className="text-3xl font-bold text-black mb-6">
            The Journey Ahead
          </h2>
          <p className="mb-8 leading-relaxed">
            Today, E-Cell IIIT Trichy is steadily growing as a platform for
            entrepreneurial learning and collaboration on campus. With over 10
            events conducted and 200+ students engaged, we continue to expand
            our reach and impact. We are working towards building a strong
            ecosystem — connecting students with opportunities, knowledge, and
            like-minded peers.Our journey is just beginning, and we aim to take
            it further with bigger initiatives, stronger networks, and a
            long-term vision of creating something truly impactful.
          </p>

          <p className="text-xl font-bold text-black mt-12 text-center">
            Be a part of the journey — and help shape what comes next.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StoryPage;
