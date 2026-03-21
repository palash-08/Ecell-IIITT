"use client";
import HeroSection from "@/components/hero-section/HeroSection";
import AboutSection from "@/components/about-section/AboutSection";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import GalleryPreview from "@/components/gallery/GalleryPreview";
import CollaborateSection from "@/components/collaborate/CollaborateSection";

import Link from "next/link";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] overflow-x-hidden selection:bg-[#FFB800] selection:text-black">
      {/* Black Background Section */}
      <HeroSection />
      
      {/* White Background Section */}
      <AboutSection />

      {/* Light Gray Background Section */}
      <FeaturedEvents />
      
       {/* Gallery Bento Grid Section */}
      <GalleryPreview />

      {/* Black Background / Premium Feel Section */}
      <CollaborateSection />

     
    </div>
  );
}
