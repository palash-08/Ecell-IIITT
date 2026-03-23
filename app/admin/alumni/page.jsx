'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiRefreshCcw, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminAlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team'); 
      // Filter for alumni
      setAlumni(res.data.data.filter(m => m.category === 'Alumni'));
      setError(null);
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError('Failed to fetch alumni directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alumni record?')) return;
    try {
      await api.delete(`/team/${id}`);
      setAlumni(alumni.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,Current Company Role,Company,Former E-Cell Position,Batch,LinkedIn"].join(",") + "\n"
      + alumni.map(a => `"${a.name}","${a.email || ''}","${a.role}","${a.company || ''}","${a.formerPosition || ''}","${a.batch || ''}","${a.linkedin || ''}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ecell_alumni_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading alumni directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-6">
        <p className="text-red-600 font-bold text-xl mb-2">{error}</p>
        <button 
          onClick={fetchAlumni} 
          className="mt-2 px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-[#FFB800] hover:text-black transition-colors shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-2">Alumni Network</h1>
          <p className="text-gray-500 font-medium text-lg">Maintain the E-Cell alumni directory and track their achievements.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto"
            >
              <FiDownload size={20} />
              Export CSV
            </button>
            <Link href="/admin/team/add?type=Alumni" className="flex items-center justify-center gap-2 bg-[#FFB800] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e6a700] transition-all shadow-sm w-full sm:w-auto">
              <FiPlus size={20} />
              Add Alumni
            </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider">Alumni Details</th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider">Current Position</th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider">Former Role</th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alumni.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">No alumni records found.</td>
                </tr>
              ) : alumni.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 md:px-6 py-5 flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-100">
                       {member.image ? (
                         <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${member.image}`} alt={member.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-gray-100 uppercase">
                           {member.name.charAt(0)}
                         </div>
                       )}
                    </div>
                    <div>
                      <p className="font-bold text-black text-base">{member.name}</p>
                      {member.email && <p className="text-[10px] text-gray-400 font-medium">{member.email}</p>}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <p className="font-bold text-gray-800">{member.role}</p>
                    {member.company && <p className="text-sm font-medium text-[#FFB800] mt-1">@ {member.company}</p>}
                  </td>
                  <td className="px-4 md:px-6 py-5 text-gray-600 font-medium text-sm">
                    {member.formerPosition || "-"}
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold border border-gray-200">
                    {member.batch || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <Link 
                        href={`/admin/team/edit/${member._id}`}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button onClick={() => handleDelete(member._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
}
