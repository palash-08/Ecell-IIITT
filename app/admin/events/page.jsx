'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiMoreVertical, FiRefreshCcw, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      setEvents(res.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to delete event');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-2">Events Management</h1>
          <p className="text-gray-500 font-medium text-lg">Manage your flagship events, hackathons, and sessions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchEvents}
            className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-black hover:bg-gray-50 transition-all shadow-sm"
            title="Refresh"
          >
            <FiRefreshCcw size={20} />
          </button>
          <Link 
            href="/admin/events/create"
            className="flex items-center gap-2 bg-[#FFB800] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e6a700] hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <FiPlus size={20} />
            Create Event
          </Link>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex flex-col items-center gap-4">
          <p className="font-bold">{error}</p>
          <button onClick={fetchEvents} className="text-sm underline font-bold">Try Again</button>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <FiCalendar size={32} />
          </div>
          <h3 className="text-xl font-bold text-black mb-1">No events found</h3>
          <p className="text-gray-500 mb-6">Start by creating your first event to see it listed here.</p>
          <Link href="/admin/events/create" className="text-[#FFB800] font-bold hover:underline">
            + Create your first event
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Event Details</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date & Venue</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                          {event.mainImage ? (
                            <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${event.mainImage}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FiCalendar size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-black text-base">{event.title}</p>
                          <p className="text-sm font-medium text-gray-500 mt-0.5">{event.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5 ">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                           <FiCalendar size={14} className="text-[#FFB800]" />
                           {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                           <FiMapPin size={14} className="text-gray-400" />
                           {event.venue}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {(() => {
                        const eventDate = new Date(event.date);
                        eventDate.setHours(0, 0, 0, 0);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isCompleted = event.status === 'Completed' || eventDate < today;
                        const displayStatus = isCompleted ? 'Completed' : 'Upcoming';
                        
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            !isCompleted ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${!isCompleted ? 'bg-amber-400' : 'bg-green-500'}`}></span>
                            {displayStatus}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/events/${event._id}/submissions`}
                          className="p-2 text-gray-400 hover:text-[#FFB800] hover:bg-amber-50 rounded-lg transition-colors" 
                          title="View Submissions"
                        >
                          <FiUser size={18} />
                        </Link>
                        <Link 
                          href={`/admin/events/${event._id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(event._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
