'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiFileText, FiImage, FiClock, FiCheckCircle } from 'react-icons/fi';
import RegistrationForm from '@/components/events/RegistrationForm';
import BentoGallery from '@/components/gallery/BentoGallery';
import Link from 'next/link';
import api from '@/lib/api';

// Import local components
import EventDetailHeader from '@/components/events/EventDetailHeader';
import EventHighlightsSection from '@/components/events/EventHighlightsSection';
import EventResourcesSection from '@/components/events/EventResourcesSection';

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    const checkStatus = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      setCheckingRegistration(true);
      try {
        const res = await api.get(`/registrations/check/${id}`);
        setIsRegistered(res.data.isRegistered);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Error checking registration status:', err);
        }
      } finally {
        setCheckingRegistration(false);
      }
    };

    const fetchGalleryItems = async () => {
      try {
        const res = await api.get(`/gallery?event=${id}`);
        setGalleryItems(res.data.data);
      } catch (err) {
        console.error('Error fetching event gallery:', err);
      } finally {
        setLoadingGallery(false);
      }
    };

    if (id) {
      fetchEvent();
      checkStatus();
      fetchGalleryItems();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <h2 className="text-3xl font-black text-black mb-4">Event Not Found</h2>
        <Link href="/events" className="text-[#FFB800] font-bold hover:underline no-underline">Back to all events</Link>
      </div>
    );
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      
      <EventDetailHeader event={event} />

      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-20">
        {/* Main Content */}
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
          {galleryItems && galleryItems.length > 0 && (
            <section className="mb-16">
              <h3 className="text-3xl font-black text-black mb-10 flex items-center gap-4">
                <FiImage className="text-[#FFB800]" /> Event <span className="text-gray-300">Gallery.</span>
              </h3>
              <BentoGallery items={galleryItems} />
            </section>
          )}

          {/* Legacy Gallery images (if any) */}
          {event.galleryImages && event.galleryImages.length > 0 && galleryItems.length === 0 && (
            <section className="mb-16">
              <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
                <FiImage className="text-[#FFB800]" /> Event Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.galleryImages.map((img, i) => {
                  const isVideo = img.match(/\.(mp4|webm|ogg|mov)$/i);
                  return (
                    <div key={i} className="relative aspect-video rounded-3xl overflow-hidden border border-gray-100 group">
                      {isVideo ? (
                        <video 
                          src={`${API_URL}${img}`} 
                          className="w-full h-full object-cover" 
                          controls
                          muted
                          loop
                          preload="metadata"
                        />
                      ) : (
                        <img 
                          src={`${API_URL}${img}`} 
                          alt="Gallery item" 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <EventResourcesSection links={event.externalLinks} />
        </div>

        {/* Form Sidebar */}
        <div className="w-full lg:w-[400px]">
          {isRegistered ? (
             <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center sticky top-24 shadow-sm">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">Already <span className="text-green-600">Registered</span></h3>
                <p className="text-gray-600 font-medium mb-8">You've successfully signed up for this event. Check your registrations for details.</p>
                <Link 
                  href="/my-registrations"
                  className="inline-block w-full bg-black text-white font-black py-4 rounded-2xl shadow-xl hover:bg-[#FFB800] hover:text-black transition-all uppercase tracking-widest text-sm no-underline"
                >
                  View My Submissions
                </Link>
             </div>
          ) : (() => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isCompleted = event.status === 'Completed' || eventDate < today;
            
            if (!isCompleted) {
              return (
                <div className="sticky top-24">
                  <RegistrationForm eventId={event._id} schema={event.customFormSchema || []} />
                </div>
              );
            } else {
              return (
                <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center sticky top-24 shadow-sm">
                   <FiClock className="text-gray-300 mx-auto mb-4" size={40} />
                   <h3 className="text-sm font-black text-gray-400 mb-2 uppercase tracking-widest">Registrations Closed</h3>
                   <p className="text-gray-500 text-xs font-bold leading-relaxed px-4">This event has already taken place or registrations are closed.</p>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
}
