'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiDownload, FiUser, FiMail, FiPhone, FiCalendar, FiRefreshCcw } from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function EventSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading participants...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/events" className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors mb-4 no-underline">
          <FiArrowLeft />
          Back to Events
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-1">
                {event?.title} <span className="text-[#FFB800]">Submissions</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">Viewing {registrations.length} total registrations for this event.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={fetchData} className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-black shadow-sm">
                <FiRefreshCcw size={20} />
             </button>
             <button 
                onClick={handleExport}
                disabled={registrations.length === 0}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50"
             >
                <FiDownload size={20} />
                Export to CSV
             </button>
          </div>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiUser size={32} />
            </div>
            <h3 className="text-xl font-bold text-black mb-1">No registrations yet</h3>
            <p className="text-gray-500">Wait for participants to sign up from the public event page.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Participant</th>
                  {/* Dynamically show first few custom fields or just the core ones */}
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center text-[#FFB800] font-bold">
                            {reg.formData['Full Name']?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-black text-base">{reg.formData['Full Name'] || 'Unknown'}</p>
                          <p className="text-sm font-medium text-gray-500">{reg.formData['Email Address'] || 'No Email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold">{new Date(reg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(reg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(reg.formData).map(([key, value]) => {
                          if (key === 'Full Name' || key === 'Email Address') return null;
                          return (
                            <div key={key} className="text-[10px] bg-gray-100 px-2 py-1 rounded border border-gray-200 max-w-[200px] truncate">
                              <span className="font-bold text-gray-400 uppercase mr-1">{key}:</span>
                              <span className="text-gray-700">{String(value)}</span>
                            </div>
                          );
                        })}
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
