"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

const TeamCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-[#FFB800] hover:shadow-xl transition-all duration-300"
    >
      <div className="mx-auto mt-8 flex justify-center">
      <div className="relative w-64 h-72">
        <Image
          src={member.image || "/Ecelllogo.jpeg"}
          alt={member.name}
          fill
          className="rounded-2xl shadow-sm border border-gray-100 object-cover"
        />
      </div>
    </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-black group-hover:text-[#FFB800] transition-colors">
          {member.name}
        </h3>
        <p className="text-md text-gray-500 font-medium mt-1">{member.role}</p>
      </div>
    </motion.div>
  );
};

const TeamSection = ({ title, members }) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-black mb-12 tracking-tight"
        >
          {title}
          <div className="w-20 h-2 bg-[#FFB800] mt-4 rounded-full"></div>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
