'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiCalendar, FiMapPin, FiArrowLeft, FiTag, FiClock, FiFileText, FiImage, FiGrid, FiLink, FiArrowUpRight, FiPlay, FiCheckCircle } from 'react-icons/fi';
import RegistrationForm from '@/components/events/RegistrationForm';
import BentoGallery from '@/components/gallery/BentoGallery';
import Link from 'next/link';
import api from '@/lib/api';

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
      setCheckingRegistration(true);
      try {
        const res = await api.get(`/registrations/check/${id}`);
        setIsRegistered(res.data.isRegistered);
      } catch (err) {
        console.error('Error checking registration status:', err);
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
        <Link href="/events" className="text-[#FFB800] font-bold hover:underline">Back to all events</Link>
      </div>
    );
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      
      {/* Dynamic Header */}
      <div className="bg-black py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/events" className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition-colors mb-8 no-underline">
            <FiArrowLeft /> Back to Events
          </Link>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3 aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={event.mainImage ? `${API_URL}${event.mainImage}` : '/Ecelllogo.jpeg'} 
                alt={event.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <span className="px-4 py-1.5 bg-[#FFB800] text-black text-xs font-black rounded-full shadow-xl uppercase tracking-widest mb-6 inline-block">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">{event.title}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="w-12 h-12 bg-[#FFB800]/20 rounded-xl flex items-center justify-center text-[#FFB800]">
                    <FiCalendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Date & Time</p>
                    <p className="text-white font-bold">
                      {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {(event.startTime || event.endTime) && (
                      <p className="text-gray-400 text-xs font-bold mt-1">
                        {event.startTime} {event.endTime && `- ${event.endTime}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="w-12 h-12 bg-[#FFB800]/20 rounded-xl flex items-center justify-center text-[#FFB800]">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Venue</p>
                    <p className="text-white font-bold">{event.venue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

          {/* Highlights Section */}
          {event.highlights && event.highlights.length > 0 && (
            <section className="mb-16">
              <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
                <FiGrid className="text-[#FFB800] shadow-sm" /> Event Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {event.highlights.map((h, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl hover:border-[#FFB800]/30 transition-all group">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#FFB800] transition-colors">{h.label}</p>
                    <p className="text-xl font-black text-black">{h.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

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

          {/* External Links Section */}
          {event.externalLinks && event.externalLinks.length > 0 && (
            <section className="mb-16">
              <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
                <FiLink className="text-[#FFB800]" /> Useful Resources
              </h3>
              <div className="flex flex-wrap gap-4">
                {event.externalLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[#FFB800] hover:bg-[#FFB800]/5 transition-all group"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-[#FFB800] group-hover:text-black transition-colors">
                      <FiLink size={18} />
                    </div>
                    <span className="font-bold text-gray-700">{link.label}</span>
                    <FiArrowUpRight className="text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </section>
          )}
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
                  className="inline-block w-full bg-black text-white font-black py-4 rounded-2xl shadow-xl hover:bg-[#FFB800] hover:text-black transition-all uppercase tracking-widest text-sm"
                >
                  View My Submissions
                </Link>
             </div>
          ) : event.status === 'Upcoming' ? (
            <div className="sticky top-24">
              <RegistrationForm eventId={event._id} schema={event.customFormSchema || []} />
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center sticky top-24">
               <FiClock className="text-gray-300 mx-auto mb-4" size={40} />
               <h3 className="text-xl font-bold text-gray-400 mb-2">Registrations Closed</h3>
               <p className="text-gray-500 text-sm">Follow our social media for updates on the next edition!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
