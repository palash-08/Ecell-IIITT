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

  if (pathname && pathname.startsWith("/admin")) {
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

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] transition-all duration-300 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/20 group-hover:border-[#FFB800] transition-colors bg-white">
            <Image
              src="/Ecell-logo.png"
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
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`relative text-sm font-bold transition-colors duration-300 ${
                  pathname === link.href ||
                  (pathname.startsWith(link.href) && link.href !== "/")
                    ? "text-[#FFB800]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
                {(pathname === link.href ||
                  (pathname.startsWith(link.href) && link.href !== "/")) && (
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
                  <span className="text-sm font-bold text-white group-hover:text-[#FFB800] transition-colors">
                    {user.name.split(" ")[0]}
                  </span>
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
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Logged in as
                        </p>
                        <p className="text-sm font-bold text-black truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        {user.role !== "user" && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-all"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          href="/my-registrations"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-all"
                        >
                          My Registrations
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
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
                <Link
                  href="/login"
                  className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 bg-[#FFB800] hover:bg-[#e6a600] text-black text-xs font-black rounded-full transition-all shadow-lg shadow-[#FFB800]/20 uppercase tracking-widest"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white hover:text-[#FFB800] transition-transform active:scale-95 duration-200"
        >
          {isOpen ? <HiX size={32} /> : <HiMenuAlt3 size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="lg:hidden bg-black/95 backdrop-blur-3xl border-b border-white/10 overflow-hidden shadow-2xl"
          >
            <ul className="flex flex-col p-8 gap-6 max-h-[85vh] overflow-y-auto">
              {navLinks.map((link) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-2xl font-black transition-all ${
                      pathname === link.href ||
                      (pathname.startsWith(link.href) && link.href !== "/")
                        ? "text-[#FFB800] translate-x-2"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}

              <motion.li 
                variants={itemVariants}
                className="pt-6 border-t border-white/10 mt-2"
              >
                {user ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                      <div className="w-12 h-12 rounded-full bg-[#FFB800] flex items-center justify-center text-black font-black text-lg uppercase shadow-lg shadow-[#FFB800]/30">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-lg font-black leading-tight">{user.name}</p>
                        <p className="text-gray-500 text-xs font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {user.role !== "user" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center py-4 rounded-xl bg-[#FFB800] text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-[#FFB800]/20"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/my-registrations"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest"
                      >
                        My Registrations
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-sm uppercase tracking-widest"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-4 text-center font-black text-white bg-white/5 border border-white/10 rounded-2xl uppercase tracking-widest text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-4 text-center font-black text-black bg-[#FFB800] rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-[#FFB800]/20"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
