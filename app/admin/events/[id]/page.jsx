'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiUsers, FiEdit2, FiList, FiFileText, FiImage, FiCheckCircle } from 'react-icons/fi';
import api from '@/lib/api';

// Import public components for preview
import RegistrationForm from '@/components/events/RegistrationForm';
import BentoGallery from '@/components/gallery/BentoGallery';
import EventDetailHeader from '@/components/events/EventDetailHeader';
import EventHighlightsSection from '@/components/events/EventHighlightsSection';
import EventResourcesSection from '@/components/events/EventResourcesSection';

// Import admin components
import AdminHeader from '@/components/admin/shared/AdminHeader';
import AdminStatusBlock from '@/components/admin/shared/AdminStatusBlock';

export default function EventOverviewPage() {
  const params = useParams();
  const { id } = params;

  const [event, setEvent] = useState(null);
  const [regCount, setRegCount] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, regRes, galleryRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/registrations/event/${id}`),
        api.get(`/gallery?event=${id}`)
      ]);
      setEvent(eventRes.data.data);
      setRegCount(regRes.data.data.length);
      setGalleryItems(galleryRes.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching event overview:', err);
      setError('Failed to load event data.');
    } finally {
      setLoading(false);
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) return <AdminStatusBlock type="loading" message="Loading Event Mockup..." />;
  if (error) return <AdminStatusBlock type="error" message={error} onRetry={fetchData} />;
  if (!event) return <AdminStatusBlock type="empty" message="Event not found" />;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <AdminHeader 
        backLink="/admin/events"
        title={event.title}
        highlight="Live Preview"
        description="Review how your event appears to users and track performance."
        actions={[
          {
            href: `/admin/events/${id}/submissions`,
            icon: <FiList size={20} />,
            label: `View Submissions (${regCount})`,
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

      {/* Admin Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-center gap-6 shadow-sm">
              <div className="w-14 h-14 bg-white text-[#FFB800] rounded-2xl flex items-center justify-center shadow-sm">
                  <FiUsers size={28} />
              </div>
              <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Total Registrations</p>
                  <h3 className="text-3xl font-black text-black leading-none">{regCount}</h3>
              </div>
          </div>
          <div className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-3xl p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white text-gray-400 rounded-2xl flex items-center justify-center shadow-sm">
                    <FiCheckCircle size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Event Status</p>
                    <h3 className="text-xl font-black text-black leading-none">{event.status || 'Upcoming'}</h3>
                </div>
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Updated</p>
                <p className="text-sm font-bold text-gray-500">{new Date(event.updatedAt).toLocaleDateString()}</p>
              </div>
          </div>
      </div>

      <div className="relative border border-gray-100 rounded-[3rem] overflow-hidden bg-white shadow-xl">
          <div className="overflow-hidden bg-white"> 
            <EventDetailHeader event={event} />
            <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-20">
              {/* Main Content Preview */}
              <div className="flex-1">
                <section className="mb-16">
                  <h2 className="text-3xl font-black text-black mb-8 flex items-center gap-3">
                    <FiFileText className="text-[#FFB800]" /> About the Event
                  </h2>
                  <div className="prose max-w-none text-gray-600 font-medium text-lg leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </div>
                </section>
      
                <EventHighlightsSection highlights={event.highlights} />
      
                {/* Media Gallery Section */}
                {loadingGallery ? (
                  <section className="mb-16">
                    <h3 className="text-3xl font-black text-black mb-10 flex items-center gap-4">
                      <FiImage className="text-gray-200" /> Event <span className="text-gray-200">Gallery.</span>
                    </h3>
                    <div className="h-64 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 animate-pulse">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Media...</p>
                    </div>
                  </section>
                ) : (() => {
                  const mergedMedia = [...galleryItems];
                  if (event.galleryImages && event.galleryImages.length > 0) {
                    event.galleryImages.forEach((img, idx) => {
                      const url = typeof img === 'string' ? img : img.url;
                      if (!mergedMedia.some(m => m.url === url)) {
                        mergedMedia.push({
                          _id: `event-img-${idx}`,
                          url: url,
                          mediaType: url.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image',
                          title: event.title,
                          category: event.category,
                          size: img.size || 0
                        });
                      }
                    });
                  }
      
                  if (mergedMedia.length > 0) {
                    return (
                      <section className="mb-16">
                        <h3 className="text-3xl font-black text-black mb-10 flex items-center gap-4">
                          <FiImage className="text-[#FFB800]" /> Event <span className="text-gray-300">Gallery.</span>
                        </h3>
                        <BentoGallery items={mergedMedia} />
                      </section>
                    );
                  }
                  return null;
                })()}
      
                <EventResourcesSection links={event.externalLinks} />
              </div>
      
              {/* Sidebar Preview */}
              <div className="w-full lg:w-[400px]">
                  <div className="sticky top-24">
                    <div className="mb-4 flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Form Preview Only</span>
                        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                    </div>
                    {/* Wrapped in div to clearly prevent interaction while still showing structure */}
                    <div className="opacity-80 pointer-events-none select-none">
                       <RegistrationForm eventId={event._id} schema={event.customFormSchema || []} />
                    </div>
                    <p className="mt-4 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Interactions disabled in admin view</p>
                  </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
