import React, { useState } from 'react';
import { FiUserPlus, FiUsers, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function AddAdminForm({ teamMembers, fetchAdmins }) {
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminRole, setNewAdminRole] = useState('admin');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState(false);

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

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                <FiUserPlus className="text-red-600" /> Promote to Admin
            </h3>
            
            <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FiUsers /> Assign from Team
                </label>
                <select 
                    onChange={handleSelectFromTeam}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all font-medium text-sm cursor-pointer"
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium appearance-none cursor-pointer"
                    >
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                    </select>
                </div>
                <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-600/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
    );
}
