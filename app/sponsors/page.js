"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { FiGlobe, FiUsers, FiBriefcase, FiCheckCircle } from "react-icons/fi";

const benefits = [
    {
        title: "Brand Visibility",
        description: "Get your brand in front of 1000+ top engineering and management students.",
        icon: <FiGlobe className="text-3xl text-[#FFB800]" />
    },
    {
        title: "Talent Acquisition",
        description: "Direct access to some of the brightest minds for internships and placements.",
        icon: <FiUsers className="text-3xl text-[#FFB800]" />
    },
    {
        title: "Networking",
        description: "Connect with industry leaders, startup founders, and investors during our summits.",
        icon: <FiBriefcase className="text-3xl text-[#FFB800]" />
    }
];

const tiers = [
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
        delay: 0.1,
        featured: true
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
                        Join E-Cell IIIT Trichy in our mission to ignite the entrepreneurial spirit. Gain unparalleled exposure and connect with the next generation of innovators.
                    </motion.p>
                </div>

                {/* Benefits Section */}
                <div className="mb-40">
                    <h2 className="text-3xl md:text-5xl font-black text-center mb-20 tracking-tight">Why <span className="text-gray-200">Sponsor?</span></h2>
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
                                <h3 className="text-2xl font-black text-white mb-4">{benefit.title}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sponsorship Tiers */}
                <div className="mb-40">
                    <h2 className="text-3xl md:text-5xl font-black text-center mb-20 tracking-tight">Sponsorship <span className="text-gray-200">Tiers.</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {tiers.map((tier, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: tier.delay }}
                                className={`bg-[#0a0a0a] border ${tier.featured ? 'border-[#FFB800]/30 shadow-[#FFB800]/5' : 'border-[#222222]'} p-12 rounded-[3rem] relative overflow-hidden group hover:border-[#FFB800]/40 transition-all shadow-2xl flex flex-col`}
                            >
                                {tier.featured && (
                                    <div className="absolute top-8 right-8">
                                        <span className="bg-[#FFB800] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>
                                    </div>
                                )}
                                <div className={`w-12 h-1 bg-gradient-to-r ${tier.featured ? 'from-[#FFB800] to-amber-600' : 'from-gray-600 to-gray-400'} rounded-full mb-8`} />
                                <h3 className="text-3xl font-black text-white mb-2">{tier.name}</h3>
                                <div className={`${tier.textAccent} font-black mb-10 uppercase tracking-[0.2em] text-[10px]`}>
                                    {tier.price} Tier
                                </div>
                                <ul className="space-y-6 mb-12 flex-1">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-gray-400 font-bold text-sm leading-relaxed">
                                            <FiCheckCircle className={`mt-1 mr-4 flex-shrink-0 ${tier.featured ? 'text-[#FFB800]' : 'text-gray-600'}`} size={16} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link 
                                    href="/contact" 
                                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all ${
                                        tier.featured 
                                        ? 'bg-[#FFB800] text-black hover:bg-amber-400 shadow-xl shadow-[#FFB800]/10' 
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                    }`}
                                >
                                    Inquire Now
                                </Link>
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
