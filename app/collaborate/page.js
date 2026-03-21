"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { FiGlobe, FiUsers, FiBriefcase, FiCheckCircle } from "react-icons/fi";

const benefits = [
  {
    title: "Brand Visibility",
    description:
      "Showcase your brand to a growing community of driven and talented students at IIIT Trichy.",
    icon: <FiGlobe className="text-3xl text-[#FFB800]" />,
  },
  {
    title: "Early Talent Access",
    description:
      "Connect with motivated students who are eager to learn, build, and contribute to real-world projects.",
    icon: <FiUsers className="text-3xl text-[#FFB800]" />,
  },
  {
    title: "Meaningful Engagement",
    description:
      "Engage with students through workshops, sessions, and collaborative initiatives that create real impact.",
    icon: <FiBriefcase className="text-3xl text-[#FFB800]" />,
  },
];

const opportunities = [
  "Collaborate on workshops, seminars, and speaker sessions",
  "Engage directly with students through interactive events",
  "Showcase your brand across our digital platforms",
  "Contribute to building a strong entrepreneurial ecosystem",
  "Identify and connect with high-potential students",
];

const CollaboratePage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-[#FFB800]/5 rounded-full blur-[150px]" />
        <div className="absolute right-[-10%] bottom-[10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-32">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FFB800] font-black uppercase tracking-[0.4em] text-sm mb-6 block"
          >
            Partner With Us
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter"
          >
            Build the <span className="text-[#FFB800]">Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            E-Cell IIIT Trichy is in its growth phase, building a strong foundation
            for entrepreneurship on campus. We invite organizations and individuals
            to collaborate with us in shaping the next generation of innovators.
          </motion.p>
        </div>

        {/* Benefits Section */}
        <div className="mb-40">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-20 tracking-tight">
            Why <span className="text-gray-200">Collaborate?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111111] border border-[#222222] p-12 rounded-[2.5rem] hover:border-[#FFB800]/30 hover:-translate-y-2 transition-all duration-500 shadow-2xl relative group"
              >
                <div className="w-16 h-16 bg-[#FFB800]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FFB800] group-hover:text-black transition-all">
                  {benefit.icon}
                </div>

                <h3 className="text-2xl font-black text-white mb-4">
                  {benefit.title}
                </h3>

                <p className="text-gray-400 font-medium leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Opportunities Section */}
        <div className="mb-40">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-20 tracking-tight">
            Partnership <span className="text-gray-200">Opportunities.</span>
          </h2>

          <div className="max-w-3xl mx-auto bg-[#0a0a0a] border border-[#222222] p-12 rounded-[3rem] shadow-2xl">
            <ul className="space-y-6">
              {opportunities.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-gray-400 font-bold text-sm leading-relaxed"
                >
                  <FiCheckCircle
                    className="mt-1 mr-4 flex-shrink-0 text-[#FFB800]"
                    size={18}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-[#1A1A1A] border border-[#262626] rounded-[2.5rem] p-16 relative overflow-hidden"
        >
          <div className="absolute top-[-50%] left-[20%] w-[600px] h-[600px] bg-[#FFB800]/5 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10 tracking-tight">
            Let’s Build Something Meaningful Together
          </h2>

          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto font-medium relative z-10">
            Whether you&apos;re a startup, organization, or individual, we&apos;re always
            open to collaborations that create value for students and the
            ecosystem.
          </p>

          <Link
            href="/contact"
            className="relative z-10 inline-block px-12 py-5 bg-[#FFB800] text-black font-bold text-lg rounded-full hover:bg-[#e6a700] hover:-translate-y-1 transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)]"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CollaboratePage;