"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCalendar, FiUsers, FiAward, FiLogOut, FiBriefcase, FiMail, FiShield, FiGrid } from "react-icons/fi";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = ({ children }) => {
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
    { name: "Manage Admins", href: "/admin/manage-admins", icon: FiShield },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <span className="text-xl font-bold tracking-tight">E-Cell <span className="text-[#FFB800]">Admin</span></span>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            {navItems.map((item) => {
              const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-[#FFB800]/10 text-[#FFB800]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
                  <item.icon size={18} className={isActive ? 'text-[#FFB800]' : 'text-gray-400'} />
                  {item.name}
                </Link>
              );
            })}
            
            {user?.role === 'super-admin' && (
              <>
                <div className="pt-4 pb-2 px-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Super Admin</span>
                </div>
                {superAdminItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-red-600/10 text-red-600' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
                      <item.icon size={18} className={isActive ? 'text-red-600' : 'text-gray-400'} />
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
            <FiHome size={18} />
             Back to Website
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <FiLogOut size={18} />
             Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 md:hidden shadow-sm">
            <span className="text-xl font-bold tracking-tight">E-Cell <span className="text-[#FFB800]">Admin</span></span>
            <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black">Exit</Link>
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
          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F5F5F5]">
            {children}
          </main>
        </ProtectedRoute>
      </div>
    </div>
  );
};

export default AdminLayout;
