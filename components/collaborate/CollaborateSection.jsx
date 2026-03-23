"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

const CollaborateSection = () => {
  return (
    <section className="py-32 px-6 bg-white border-y border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-black mb-6 tracking-tight">
           Collaborate <span className="text-[#FFB800]">With Us</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
We're building a growing ecosystem of innovators, creators, and organizations. 
Join us in shaping opportunities and experiences for the next generation of builders.          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/collaborate"
            className="inline-flex items-center px-6 py-3 md:px-10 md:py-5 bg-[#FFB800] text-black font-bold text-base md:text-lg rounded-full hover:bg-[#e6a700] hover:-translate-y-1 hover:shadow-lg transition-all shadow-sm"
          >
            Start a Collaboration
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CollaborateSection;
