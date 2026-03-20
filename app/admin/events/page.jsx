'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiCalendar, FiRefreshCcw } from 'react-icons/fi';
import api from '@/lib/api';

// Import shared and local components
import AdminHeader from '@/components/admin/shared/AdminHeader';
import AdminStatusBlock from '@/components/admin/shared/AdminStatusBlock';
import EventListTable from '@/components/admin/events/EventListTable';

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

  return (
    <div className="max-w-7xl mx-auto">
      <AdminHeader 
        title="Events"
        highlight="Management"
        description="Manage your flagship events, hackathons, and sessions."
        actions={[
          {
            icon: <FiRefreshCcw size={20} />,
            onClick: fetchEvents,
            title: "Refresh"
          },
          {
            href: "/admin/events/create",
            icon: <FiPlus size={20} />,
            label: "Create Event",
            variant: "primary"
          }
        ]}
      />

      {loading ? (
        <AdminStatusBlock type="loading" message="Loading events..." />
      ) : error ? (
        <AdminStatusBlock 
          type="error" 
          message={error} 
          onRetry={fetchEvents} 
        />
      ) : events.length === 0 ? (
        <AdminStatusBlock 
          type="empty" 
          message="No events found" 
          subMessage="Start by creating your first event to see it listed here."
          onRetry={fetchEvents}
        >
          <FiCalendar size={32} />
        </AdminStatusBlock>
      ) : (
        <EventListTable events={events} onDelete={handleDelete} />
      )}
    </div>
  );
}
