'use client';

import React, { useState, useEffect } from 'react';
import { FiDownload, FiUser, FiRefreshCcw } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
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
    
    // Get all unique keys from formData across all registrations safely
    const dynamicKeys = Array.from(new Set(registrations.flatMap(r => Object.keys(r.formData || {}))));
    
    // Separate Date and Time for cleaner CSV parsing
    const headers = ['Registration Date', 'Registration Time', ...dynamicKeys];
    
    const csvRows = registrations.map(reg => {
      const d = new Date(reg.createdAt);
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const rowData = headers.map(header => {
        if (header === 'Registration Date') return `"${dateStr}"`;
        if (header === 'Registration Time') return `"${timeStr}"`;
        
        // Safely extract and escape values to prevent CSV breaking
        const val = reg.formData ? (reg.formData[header] || '') : '';
        const escapedVal = String(val).replace(/"/g, '""');
        return `"${escapedVal}"`;
      });
      
      return rowData.join(',');
    });

    // Add \uFEFF BOM for Excel UTF-8 compatibility
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.map(h => `"${h}"`).join(','), ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `submissions_${event?.title || 'event'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
