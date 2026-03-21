"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

const AboutSection = () => {
  return (
    <section className="w-full relative py-24 bg-white overflow-hidden text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10 border-b border-gray-200 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-8 text-black tracking-tight"
        >
          About E-Cell IIIT Trichy
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-10 font-medium"
        >
          E-Cell IIIT Trichy is a student-driven initiative founded in September
          2022, focused on building a strong entrepreneurial ecosystem within
          the campus. We create opportunities for students to explore
          entrepreneurship through workshops, competitions, and hands-on
          experiences — helping them move from ideas to execution. From hosting
          events like Venture Quest and finance workshops to organizing engaging
          sessions and competitions, we aim to continuously push students
          towards innovation and growth. Guided by our ethos,{" "}
          <span className="text-black font-bold">"Catalyzing Reformers"</span>,
          we are committed to shaping individuals who can build, lead, and
          create meaningful impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            href="/story"
            className="inline-block bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#FFB800] hover:text-black hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            Read Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
