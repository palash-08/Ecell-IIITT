'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCcw, FiUser, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';
import { resolveImageUrl } from '@/lib/utils';

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faculty');
      setFaculty(res.data.data);
    } catch (err) {
      console.error('Error fetching faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await api.delete(`/faculty/${id}`);
      setFaculty(faculty.filter(f => f._id !== id));
    } catch (err) {
      alert('Failed to delete faculty member');
    }
  };

  const toggleStatus = async (f) => {
    try {
      const res = await api.put(`/faculty/${f._id}`, { active: !f.active });
      setFaculty(faculty.map(item => item._id === f._id ? res.data.data : item));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-2">Faculty Management</h1>
          <p className="text-gray-500 font-medium">Manage faculty Incharge and their messages for the About page.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
                onClick={fetchFaculty}
                className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-black hover:border-gray-300 transition-all order-2 sm:order-1"
            >
                <FiRefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                <span className="sm:hidden ml-2 font-bold">Refresh List</span>
            </button>
            <Link 
            href="/admin/faculty/create" 
            className="flex items-center justify-center gap-2 bg-[#FFB800] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e6a700] hover:-translate-y-0.5 transition-all shadow-sm order-1 sm:order-2 w-full sm:w-auto"
            >
            <FiPlus size={20} />
            Add Faculty
            </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Faculty Member</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-8 h-8 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
                         <span className="text-sm font-bold text-gray-400">Loading faculty list...</span>
                      </div>
                   </td>
                </tr>
              ) : faculty.length === 0 ? (
                <tr>
                   <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold">
                      No faculty members found. Add one to get started.
                   </td>
                </tr>
              ) : (
                faculty.map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 md:px-8 py-5 md:py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                          {f.image ? (
                            <img src={resolveImageUrl(f.image)} alt={f.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FiUser size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-black">{f.name}</div>
                          <div className="flex gap-2 items-center mt-1">
                            {f.email && <span className="text-[10px] text-gray-400 font-bold lowercase">{f.email}</span>}
                            {f.linkedin && <a href={f.linkedin} target="_blank" className="text-[10px] text-blue-500 font-bold uppercase tracking-tight hover:underline">LinkedIn</a>}
                          </div>
                          <div className="text-[10px] text-green-600 font-bold uppercase tracking-tight flex items-center gap-1 mt-1">
                             <FiMessageSquare size={10} /> Message Included
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-5 md:py-6">
                      <span className="text-sm font-bold text-gray-600">{f.role}</span>
                    </td>
                    <td className="px-4 md:px-8 py-5 md:py-6 text-center">
                      <button 
                        onClick={() => toggleStatus(f)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${f.active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                      >
                        {f.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 md:px-8 py-5 md:py-6">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/faculty/edit/${f._id}`}
                          className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteFaculty(f._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
