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
            How a small group of dreamers built the entrepreneurship hub of IIIT Trichy.
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
            Every great venture starts with a simple question: "What if?" 
            For E-Cell IIIT Trichy, that question was asked in a small dorm room by a few passionate students who realized that while technical skills were being honed in classrooms, the business acumen required to build real-world solutions was missing. We wanted to bridge the gap between innovation and execution.
          </p>

          <h2 className="text-3xl font-bold text-black mb-6">Building the Foundation</h2>
          <p className="mb-8 leading-relaxed">
            With the support of our incredible faculty and the administration, E-Cell was officially born. Our initial days were spent convincing peers that entrepreneurship was not just about starting companies, but about adopting a mindset of problem-solving. We started with small ideation workshops and pitch sessions. The response was overwhelming.
          </p>

          <div className="my-12 p-8 bg-[#F5F5F5] rounded-3xl border-l-4 border-[#FFB800] relative">
            <FaQuoteLeft className="text-4xl text-[#FFB800]/20 absolute top-6 left-6" />
            <p className="text-2xl font-bold text-black italic relative z-10 pl-8">
              "We don't just build startups here. We build founders who are resilient enough to build anything."
            </p>
          </div>

          <h2 className="text-3xl font-bold text-black mb-6">The Journey Ahead</h2>
          <p className="mb-8 leading-relaxed">
            Today, what started as a small club has transformed into the central nexus for startup culture at IIIT Trichy. We've hosted flagship events like E-Summits, continuous hackathons, and brought in industry leaders to mentor our students. But our story is still being written. We continue to empower students to take risks, fail fast, and build products that matter.
          </p>
          
          <p className="text-xl font-bold text-black mt-12 text-center">
            Join us, and let's write the next chapter together.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StoryPage;
