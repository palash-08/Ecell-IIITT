"use client";
import React from "react";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-black border-t border-white/10 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Logo + Description */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white p-1 rounded-full">
              <img
                src="/Ecell-logo.png"
                alt="E-Cell IIIT Trichy"
                className="h-10 w-10 object-cover rounded-full"
              />
            </div>
            <span className="font-bold text-xl text-white">
              E-Cell IIIT Trichy
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Fostering innovation and entrepreneurship at IIIT Trichy
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[#FFB800] font-bold mb-4 uppercase tracking-wider text-sm">
            Quick Links
          </h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="hover:text-white transition-colors"
              >
                Events
              </Link>
            </li>
            <li>
              <Link href="/team" className="hover:text-white transition-colors">
                Team
              </Link>
            </li>
            <li>
              <Link
                href="/alumni"
                className="hover:text-white transition-colors"
              >
                Alumni
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-[#FFB800] font-bold mb-4 uppercase tracking-wider text-sm">
            Follow Us
          </h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="bg-white/10 hover:bg-[#FFB800] hover:text-black p-3 rounded-full transition-all duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="bg-white/10 hover:bg-[#FFB800] hover:text-black p-3 rounded-full transition-all duration-300"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} E-Cell IIIT Trichy. All rights
          reserved.
        </p>
        <p className="mt-2 md:mt-0 shadow-sm">Built with innovation.</p>
      </div>
    </footer>
  );
};

export default Footer;
