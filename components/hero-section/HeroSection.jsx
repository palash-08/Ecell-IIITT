"use client";
import React from "react";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";
import { motion } from "motion/react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white py-32 px-6">
      {/* Abstract Glowing Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FFB800]/15 rounded-[100%] blur-[120px]" />

        {/* Subtle Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"></span>
          <span className="text-sm font-semibold text-gray-300 tracking-wide uppercase">
            Entrepreneurship Cell • IIIT Trichy
          </span>
        </motion.div>

        {/* Huge Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold leading-tight tracking-tighter mb-6"
        >
          Catalyzing <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFD25F] to-[#FFB800]">
            Reformers.
          </span>
        </motion.h1>

        {/* Typing Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-10 md:h-12 mb-8"
        >
          <h2 className="text-xl md:text-3xl font-medium text-gray-400">
            We build the next generation of{" "}
            <span className="text-white font-bold">
              <Typewriter
              words={["Founders.", "Innovators.", "Builders.", "Changemakers."]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Building a thriving entrepreneurial ecosystem at IIIT Trichy. 
We empower students through competitions, workshops, and real-world exposure to transform ideas into impactful ventures.
  </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto"
        >
          <Link
            href="/events"
            className="w-full sm:w-auto px-10 py-5 bg-[#FFB800] text-black rounded-full font-bold text-lg hover:bg-[#e6a700] transition-colors shadow-[0_0_30px_rgba(255,184,0,0.3)] hover:shadow-[0_0_50px_rgba(255,184,0,0.5)] transform hover:-translate-y-1"
          >
            Explore Events
          </Link>
          <Link
            href="/story"
            className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"
          >
            Read Our Story
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
