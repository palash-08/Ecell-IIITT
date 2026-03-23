"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiHome, FiCalendar, FiUsers, FiAward, 
  FiLogOut, FiBriefcase, FiMail, FiGrid, 
  FiMenu, FiX, FiArrowRight
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Users2 } from "lucide-react";

const AdminLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: FiHome },
    { name: "Events", href: "/admin/events", icon: FiCalendar },
    { name: "Team", href: "/admin/team", icon: FiUsers },
    { name: "Alumni", href: "/admin/alumni", icon: FiAward },
    { name: "Faculty", href: "/admin/faculty", icon: FiBriefcase },
    { name: "Messages", href: "/admin/messages", icon: FiMail },
    { name: "Gallery", href: "/admin/gallery", icon: FiGrid },
  ];

  const { user, logout } = useAuth();

  const superAdminItems = [
    { name: "Manage Admins", href: "/admin/manage-admins", icon: Users2 },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans text-black overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 96 : 300 }}
        className="bg-white border-r border-gray-200 flex-col justify-between hidden md:flex h-screen relative z-40 transition-all duration-300"
      >
        <div className="flex flex-col h-full">
          <div className={`h-20 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-8'} border-b border-gray-100 shrink-0`}>
            {isSidebarCollapsed ? (
              <span className="text-xl font-black text-[#FFB800]">E</span>
            ) : (
              <span className="text-xl font-bold tracking-tight whitespace-nowrap">E-Cell <span className="text-[#FFB800]">Admin</span></span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
            {navItems.map((item) => {
              const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center px-0 mx-4' : 'px-4 mx-4'} py-3 rounded-xl font-bold transition-all group ${isActive ? 'bg-[#FFB800] text-black shadow-lg shadow-[#FFB800]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                  title={isSidebarCollapsed ? item.name : ""}
                >
                  <item.icon size={20} className={isActive ? 'text-black' : 'text-gray-400 group-hover:text-black transition-colors'} />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
            
            {user?.role === 'super-admin' && (
              <>
                <div className={`pt-8 pb-3 ${isSidebarCollapsed ? 'text-center' : 'px-8'}`}>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{isSidebarCollapsed ? 'SUP' : 'Super Admin'}</span>
                </div>
                {superAdminItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center px-0 mx-4' : 'px-4 mx-4'} py-3 rounded-xl font-bold transition-all group ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                      title={isSidebarCollapsed ? item.name : ""}
                    >
                      <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-black transition-colors'} />
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex flex-col gap-2 shrink-0">
          <Link href="/" className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center lg:px-0' : 'px-4'} py-3 rounded-xl font-bold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors`}>
            <FiHome size={20} />
             {!isSidebarCollapsed && <span>Website</span>}
          </Link>
          <button 
            onClick={logout}
            className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center lg:px-0' : 'px-4'} py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors w-full text-left`}
          >
            <FiLogOut size={20} />
             {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-black shadow-sm z-50 transition-all hover:scale-110"
        >
          <motion.div
            animate={{ rotate: isSidebarCollapsed ? 0 : 180 }}
          >
            <FiArrowRight size={12} />
          </motion.div>
        </button>
      </motion.aside>

      {/* Mobile Sidebar/Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden flex flex-col h-full"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                <span className="text-xl font-bold tracking-tight">E-Cell <span className="text-[#FFB800]">Admin</span></span>
                <button onClick={toggleMobileMenu} className="p-2 text-gray-500 hover:text-black">
                  <FiX size={24} />
                </button>
              </div>
                <nav className="p-4 space-y-2 mt-4 flex-1 overflow-y-auto custom-scrollbar">
                  {navItems.map((item) => {
                    const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href} 
                        onClick={toggleMobileMenu}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-[#FFB800] text-black shadow-lg shadow-[#FFB800]/20' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <item.icon size={20} className={isActive ? 'text-black' : 'text-gray-400'} />
                        {item.name}
                      </Link>
                    );
                  })}
                  
                  {user?.role === 'super-admin' && (
                    <>
                      <div className="pt-6 pb-2 px-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Super Admin</span>
                      </div>
                      {superAdminItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                          <Link 
                            key={item.name} 
                            href={item.href} 
                            onClick={toggleMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                            {item.name}
                          </Link>
                        );
                      })}
                    </>
                  )}
                </nav>
              <div className="p-6 border-t border-gray-100 space-y-3">
                <Link href="/" onClick={toggleMobileMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors no-underline">
                  <FiHome size={20} />
                  Website
                </Link>
                <button 
                  onClick={() => { logout(); toggleMobileMenu(); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:text-white hover:bg-red-500 transition-all w-full text-left"
                >
                  <FiLogOut size={20} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden shadow-sm z-30">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 -ml-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                <FiMenu size={24} />
              </button>
              <span className="text-xl font-bold tracking-tight">E-Cell <span className="text-[#FFB800]">Admin</span></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FFB800] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-black uppercase text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
        </header>
        
        {/* Desktop Header area */}
        <header className="hidden md:flex h-20 bg-white/50 backdrop-blur-md border-b border-gray-200 items-center px-8 justify-end z-10">
            <div className="flex items-center gap-4">
               <span className="text-sm font-semibold text-gray-600 capitalize">{user?.role} Area</span>
               <div className="w-10 h-10 rounded-full bg-[#FFB800] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-black uppercase">
                 {user?.name?.charAt(0) || 'A'}
               </div>
            </div>
        </header>

        {/* Dynamic Inner Content */}
        <ProtectedRoute roles={['admin', 'super-admin']}>
          <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#F5F5F5]">
            {children}
          </main>
        </ProtectedRoute>
      </div>
    </div>
  );
};

export default AdminLayout;
