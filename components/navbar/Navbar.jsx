"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiUser, FiLogOut, FiLogIn } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Team", href: "/team" },
    { name: "Alumni", href: "/alumni" },
    { name: "Contact", href: "/contact" },
        { name: "Collaborate With Us", href: "/collaborate" },

  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] transition-all duration-300 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/20 group-hover:border-[#FFB800] transition-colors bg-white">
            <Image
              src="/Ecelllogo.jpeg"
              alt="E-Cell IIIT Trichy"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wide text-white group-hover:text-[#FFB800] transition-colors">
              E-Cell IIITT
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              Catalyzing Reformers
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-300 ${pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/")
                    ? "text-[#FFB800]"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                {link.name}
                {(pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/")) && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 top-full block h-[2px] w-full bg-[#FFB800] mt-1"
                  />
                )}
              </Link>
            </li>
          ))}
          
          <li className="ml-4 border-l border-white/10 pl-8 flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FFB800] flex items-center justify-center text-black font-black text-[10px] uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-white group-hover:text-[#FFB800] transition-colors">{user.name.split(' ')[0]}</span>
                </button>
                
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-[1100] border border-white/20"
                    >
                      <div className="p-4 border-b border-gray-100 italic">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
                        <p className="text-sm font-bold text-black truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {user.role !== 'user' && (
                          <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-all">
                            Admin Panel
                          </Link>
                        )}
                        <Link href="/my-registrations" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-all">
                          My Registrations
                        </Link>
                        <button 
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all text-left"
                        >
                          <FiLogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link href="/signup" className="px-5 py-2.5 bg-[#FFB800] hover:bg-[#e6a600] text-black text-xs font-black rounded-full transition-all shadow-lg shadow-[#FFB800]/20 uppercase tracking-widest">Sign Up</Link>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-[#FFB800] transition-colors"
        >
          {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <ul className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-lg font-medium ${pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/")
                        ? "text-[#FFB800]"
                        : "text-gray-300 hover:text-[#FFB800]"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              
              <li className="pt-4 border-t border-white/10 mt-2">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-[#FFB800] flex items-center justify-center text-black font-black uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                    {user.role !== 'user' && (
                      <Link href="/admin" onClick={() => setIsOpen(false)} className="text-[#FFB800] font-bold">Admin Panel</Link>
                    )}
                    <Link href="/my-registrations" onClick={() => setIsOpen(false)} className="text-gray-300 font-bold">My Registrations</Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-500 font-bold flex items-center gap-2"><FiLogOut /> Logout</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-4 text-center font-bold text-gray-300 border border-white/10 rounded-2xl">Login</Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full py-4 text-center font-bold text-black bg-[#FFB800] rounded-2xl">Sign Up</Link>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
