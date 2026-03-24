'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCcw, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';
import { resolveImageUrl } from '@/lib/utils';

export default function AdminTeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team');
      // Filter for active core members (not alumni) if needed, 
      // but the backend returns all. Let's show all and distinguish by category.
      setTeam(res.data.data.filter(m => m.category !== 'Alumni'));
      setError(null);
    } catch (err) {
      console.error('Error fetching team:', err);
      setError('Failed to fetch team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await api.delete(`/team/${id}`);
      setTeam(team.filter(m => m._id !== id));
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading team...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-2">Team Management</h1>
          <p className="text-gray-500 font-medium text-lg">Add and organize your current E-Cell core members and volunteers.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button onClick={fetchTeam} className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-black shadow-sm order-2 sm:order-1">
            <FiRefreshCcw size={20} />
            <span className="sm:hidden ml-2 font-bold">Refresh List</span>
          </button>
          <Link href="/admin/team/add" className="flex items-center justify-center gap-2 bg-[#FFB800] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e6a700] transition-all shadow-sm order-1 sm:order-2 w-full sm:w-auto">
            <FiPlus size={20} />
            Add Member
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider">Member Details</th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider">Role & Category</th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {team.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-400 font-medium">No team members found.</td>
                </tr>
              ) : team.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 md:px-6 py-5 flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
                        {member.image ? (
                          <img src={resolveImageUrl(member.image)} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                            <FiUser size={20} />
                         </div>
                       )}
                    </div>
                    <div>
                      <p className="font-bold text-black text-base">{member.name}</p>
                      <div className="flex gap-3 items-center mt-0.5">
                        {member.linkedin && <a href={member.linkedin} target="_blank" className="font-medium text-[10px] text-blue-500 hover:underline">LinkedIn</a>}
                        {member.email && <span className="text-[10px] text-gray-400 font-medium">{member.email}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <p className="font-bold text-gray-800">{member.role}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">{member.category}</p>
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
