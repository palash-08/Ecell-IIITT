"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { FaCheckCircle, FaUsers, FaGlobe, FaHandshake } from "react-icons/fa";

const benefits = [
    {
        title: "Brand Visibility",
        description: "Get your brand in front of 1000+ top engineering and management students.",
        icon: <FaGlobe className="text-4xl text-[#FFB800] mb-6" />
    },
    {
        title: "Talent Acquisition",
        description: "Direct access to some of the brightest minds for internships and placements.",
        icon: <FaUsers className="text-4xl text-[#FFB800] mb-6" />
    },
    {
        title: "Networking",
        description: "Connect with industry leaders, startup founders, and investors during our summits.",
        icon: <FaHandshake className="text-4xl text-[#FFB800] mb-6" />
    }
];

const tiers = [
    {
        name: "Title Sponsor",
        price: "Premium",
        features: [
            "Logo on all main banners & website header",
            "Dedicated exhibition stall at E-Summit",
            "5 mins speaking slot during inauguration",
            "Social media shoutouts (Dedicated)",
            "Access to participant databases"
        ],
        accent: "bg-[#FFB800]",
        textAccent: "text-[#FFB800]",
        delay: 0.1
    },
    {
        name: "Gold Sponsor",
        price: "Standard",
        features: [
            "Logo on website and event standees",
            "Shared exhibition space at E-Summit",
            "Mention during opening & closing ceremonies",
            "Social media mention (Shared post)",
            "Opportunity to distribute merch"
        ],
        accent: "bg-white",
        textAccent: "text-white",
        delay: 0.2
    },
    {
        name: "Silver Sponsor",
        price: "Basic",
        features: [
            "Logo natively displayed on website",
            "Mention in closing ceremony",
            "Social media stories mention",
            "Networking access with attendees"
        ],
        accent: "bg-gray-400",
        textAccent: "text-gray-400",
        delay: 0.3
    }
];

const SponsorsPage = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-[#FFB800]/5 rounded-full blur-[150px]" />
                <div className="absolute right-[-10%] bottom-[10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-24 border-b border-white/10 pb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        Partner With <span className="text-[#FFB800]">Us</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-xl font-medium max-w-3xl mx-auto leading-relaxed"
                    >
                        Join E-Cell IIIT Trichy in our mission to ignite the entrepreneurial spirit. Gain unparalleled exposure and connect with the next generation of innovators.
                    </motion.p>
                </div>

                {/* Benefits Section */}
                <div className="mb-32">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 tracking-tight">Why Sponsor Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#1A1A1A] border border-[#262626] p-10 rounded-3xl hover:border-[#FFB800]/50 hover:-translate-y-2 transition-all duration-300 shadow-xl"
                            >
                                {benefit.icon}
                                <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sponsorship Tiers */}
                <div className="mb-32">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 tracking-tight">Sponsorship Tiers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {tiers.map((tier, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: tier.delay }}
                                className={`bg-[#0a0a0a] border border-[#262626] p-10 rounded-3xl relative overflow-hidden group hover:border-white/30 transition-colors`}
                            >
                                <div className={`absolute top-0 left-0 w-full h-1.5 ${tier.accent}`} />
                                <h3 className="text-3xl font-extrabold text-white mb-2 mt-2">{tier.name}</h3>
                                <div className={`${tier.textAccent} text-xl font-bold mb-8 uppercase tracking-wider text-sm`}>
                                    {tier.price} Tier
                                </div>
                                <ul className="space-y-5 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-gray-300 font-medium">
                                            <FaCheckCircle className={`mt-1 mr-4 flex-shrink-0 ${tier.textAccent}`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
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
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10 tracking-tight">Let's Build the Future Together</h2>
                    <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto font-medium relative z-10">
                        Ready to elevate your brand while supporting student entrepreneurship? We're excited to collaborate with you.
                    </p>
                    <Link href="/contact" className="relative z-10 inline-block px-12 py-5 bg-[#FFB800] text-black font-bold text-lg rounded-full hover:bg-[#e6a700] hover:-translate-y-1 transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)]">
                        Contact for Sponsorship
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default SponsorsPage;
