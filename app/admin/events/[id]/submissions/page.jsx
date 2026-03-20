'use client';

import React, { useState, useEffect } from 'react';
import { FiDownload, FiUser, FiRefreshCcw } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

// Import shared and local components
import AdminHeader from '@/components/admin/shared/AdminHeader';
import AdminStatusBlock from '@/components/admin/shared/AdminStatusBlock';
import SubmissionTable from '@/components/admin/events/SubmissionTable';

export default function EventSubmissionsPage() {
  const params = useParams();
  const eventId = params.id;

  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [regRes, eventRes] = await Promise.all([
        api.get(`/registrations/event/${eventId}`),
        api.get(`/events/${eventId}`)
      ]);
      setRegistrations(regRes.data.data);
      setEvent(eventRes.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions for this event.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchData();
  }, [eventId]);

  const handleExport = () => {
    if (registrations.length === 0) return;
    
    // Get all unique keys from formData across all registrations
    const dynamicKeys = Array.from(new Set(registrations.flatMap(r => Object.keys(r.formData))));
    const headers = ['Registration Date', ...dynamicKeys];
    
    const csvRows = registrations.map(reg => {
      const rowData = headers.map(header => {
        if (header === 'Registration Date') return new Date(reg.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        return `"${reg.formData[header] || ''}"`;
      });
      return rowData.join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `submissions_${event?.title || 'event'}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <AdminHeader 
        backLink="/admin/events"
        title={event?.title}
        highlight="Submissions"
        description={`Viewing ${registrations.length} total registrations for this event.`}
        actions={[
          {
            icon: <FiRefreshCcw size={20} />,
            onClick: fetchData,
            title: "Refresh"
          },
          {
            onClick: handleExport,
            disabled: registrations.length === 0,
            icon: <FiDownload size={20} />,
            label: "Export to CSV",
            variant: "secondary"
          }
        ]}
      />

      {loading ? (
        <AdminStatusBlock type="loading" message="Loading participants..." />
      ) : error ? (
        <AdminStatusBlock 
          type="error" 
          message={error} 
          onRetry={fetchData} 
        />
      ) : registrations.length === 0 ? (
        <AdminStatusBlock 
          type="empty" 
          message="No registrations yet" 
          subMessage="Wait for participants to sign up from the public event page."
          onRetry={fetchData}
        >
          <FiUser size={32} />
        </AdminStatusBlock>
      ) : (
        <SubmissionTable registrations={registrations} />
      )}
    </div>
  );
}
