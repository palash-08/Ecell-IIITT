'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiUsers, FiEdit2, FiList, FiCalendar, FiMapPin, FiClock, FiTag } from 'react-icons/fi';
import api from '@/lib/api';

// Import shared components
import AdminHeader from '@/components/admin/shared/AdminHeader';
import AdminStatusBlock from '@/components/admin/shared/AdminStatusBlock';

export default function EventOverviewPage() {
  const params = useParams();
  const { id } = params;

  const [event, setEvent] = useState(null);
  const [regCount, setRegCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, regRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/registrations/event/${id}`)
      ]);
      setEvent(eventRes.data.data);
      setRegCount(regRes.data.data.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching event overview:', err);
      setError('Failed to load event data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) return <AdminStatusBlock type="loading" message="Loading Event Overview..." />;
  if (error) return <AdminStatusBlock type="error" message={error} onRetry={fetchData} />;
  if (!event) return <AdminStatusBlock type="empty" message="Event not found" />;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  return (
    <div className="max-w-7xl mx-auto">
      <AdminHeader 
        backLink="/admin/events"
        title={event.title}
        highlight="Overview"
        description="Quick summary and performance metrics for this event."
        actions={[
          {
            href: `/admin/events/${id}/submissions`,
            icon: <FiList size={20} />,
            label: "View Submissions",
            variant: "secondary"
          },
          {
            href: `/admin/events/${id}/edit`,
            icon: <FiEdit2 size={20} />,
            label: "Edit Event",
            variant: "primary"
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Registration Stat Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-amber-50 text-[#FFB800] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <FiUsers size={32} />
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-2 font-black">Total Registrations</p>
            <h3 className="text-6xl font-black text-black mb-2">{regCount}</h3>
            <p className="text-gray-400 font-medium text-sm">Active sign-ups to date</p>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm h-full">
            <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
               Event Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <FiCalendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="font-bold text-black">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Venue</p>
                    <p className="font-bold text-black">{event.venue}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time</p>
                    <p className="font-bold text-black">{event.startTime} - {event.endTime || 'Late'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                    <FiTag size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</p>
                    <p className="font-bold text-black">{event.category}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Description Preview</p>
              <p className="text-gray-600 line-clamp-3 italic">"{event.description}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image Preview */}
      {event.mainImage && (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-4 shadow-sm overflow-hidden mb-10">
          <div className="relative aspect-[21/9] rounded-[1.5rem] overflow-hidden">
             <img 
               src={`${API_URL}${event.mainImage}`} 
               alt={event.title} 
               className="w-full h-full object-contain"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                <h3 className="text-white text-3xl font-black">{event.title}</h3>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
