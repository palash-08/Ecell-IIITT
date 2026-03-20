'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { FiUserPlus, FiTrash2, FiShield, FiMail, FiCheck, FiAlertTriangle, FiUsers, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageAdminsPage() {
    const [admins, setAdmins] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminRole, setNewAdminRole] = useState('admin');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState(false);

    const { user } = useAuth();

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/auth/admins');
            setAdmins(res.data.data);
        } catch (err) {
            console.error('Error fetching admins:', err);
        }
    };

    const fetchTeam = async () => {
        try {
            const res = await api.get('/team');
            // Show all team members who aren't already admins in the dropdown for convenience
            setTeamMembers(res.data.data);
        } catch (err) {
            console.error('Error fetching team:', err);
        }
    };

    useEffect(() => {
        if (user?.role === 'super-admin') {
            const loadData = async () => {
                setLoading(true);
                await Promise.all([fetchAdmins(), fetchTeam()]);
                setLoading(false);
            };
            loadData();
        }
    }, [user]);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/auth/admins', { 
                email: newAdminEmail, 
                role: newAdminRole,
                name: newAdminName 
            });
            setMessage({ type: 'success', text: 'Admin added successfully!' });
            setNewAdminEmail('');
            setNewAdminName('');
            fetchAdmins();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to add admin' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSelectFromTeam = (e) => {
        const memberId = e.target.value;
        if (!memberId) return;
        
        const member = teamMembers.find(m => m._id === memberId);
        if (member) {
            setNewAdminName(member.name);
            setNewAdminEmail(member.email || '');
        }
    };

    const handleRemoveAdmin = async (id) => {
        if (!window.confirm('Are you sure you want to remove this admin? they will be demoted to regular user.')) return;

        try {
            await api.delete(`/auth/admins/${id}`);
            setMessage({ type: 'success', text: 'Admin removed successfully' });
            fetchAdmins();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to remove admin' });
        }
    };

    if (user?.role !== 'super-admin') {
        return <div className="p-10 text-center">Unauthorized. Super Admin access only.</div>;
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-black mb-2">Manage <span className="text-red-600">Admins.</span></h1>
                    <p className="text-gray-500 font-medium">Add, update, or remove administrative privileges.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Add Admin Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                            <FiUserPlus className="text-red-600" /> Promote to Admin
                        </h3>
                        
                        {/* Team Selection Dropdown */}
                        <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <FiUsers /> Assign from Team
                            </label>
                            <select 
                                onChange={handleSelectFromTeam}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all font-medium text-sm"
                            >
                                <option value="">-- Select Member --</option>
                                {teamMembers.filter(m => m.category !== 'Alumni').map(m => (
                                    <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-400 mt-2 font-medium italic">* Selection will auto-fill name and email</p>
                        </div>

                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newAdminName}
                                    onChange={(e) => setNewAdminName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">User Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={newAdminEmail}
                                    onChange={(e) => setNewAdminEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Assigned Role</label>
                                <select 
                                    value={newAdminRole}
                                    onChange={(e) => setNewAdminRole(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium appearance-none"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="super-admin">Super Admin</option>
                                </select>
                            </div>
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? 'Processing...' : 'Create Admin'}
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-[10px] text-amber-700 font-bold leading-relaxed">
                            <FiAlertTriangle className="flex-shrink-0" size={14} />
                            <span>New users will be created with default password: <strong>admin@123</strong>. They should change it after first login.</span>
                        </div>

                        <AnimatePresence>
                            {message.text && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                                >
                                    {message.type === 'success' ? <FiCheck /> : <FiAlertTriangle />}
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Admins List */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <FiShield className="text-gray-400" /> Active Administrators
                            </h3>
                            <span className="text-[10px] font-black bg-gray-200 text-gray-600 px-3 py-1 rounded-full uppercase tracking-widest">{admins.length} Total</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {loading ? (
                                <div className="p-10 text-center text-gray-400 font-medium italic">Loading admins...</div>
                            ) : admins.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 font-medium italic">No admins found.</div>
                            ) : admins.map((admin) => (
                                <div key={admin._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${admin.role === 'super-admin' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-gray-100 text-gray-400'}`}>
                                            {admin.name?.charAt(0) || <FiUser />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-black flex items-center gap-2">
                                                {admin.name}
                                                {admin.role === 'super-admin' && <span className="text-[8px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Super Admin</span>}
                                            </p>
                                            <p className="text-xs font-medium text-gray-400 flex items-center gap-1"><FiMail size={10} /> {admin.email}</p>
                                        </div>
                                    </div>
                                    {admin.email !== user?.email && (
                                        <button 
                                            onClick={() => handleRemoveAdmin(admin._id)}
                                            className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
