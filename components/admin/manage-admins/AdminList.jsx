import React, { useState } from 'react';
import { FiShield, FiUser, FiMail, FiTrash2, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function AdminList({ admins, loading, user, fetchAdmins }) {
    const [message, setMessage] = useState({ type: '', text: '' });

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

    return (
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm md:text-base">
                    <FiShield className="text-gray-400" /> Active Administrators
                </h3>
                <span className="text-[8px] md:text-[10px] font-black bg-gray-200 text-gray-600 px-2 md:px-3 py-1 rounded-full uppercase tracking-widest">{admins.length} Total</span>
            </div>
            
            <AnimatePresence>
                {message.text && (
                    <div className="p-4 bg-gray-50">
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                        >
                            {message.type === 'success' ? <FiCheck /> : <FiAlertTriangle />}
                            {message.text}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="divide-y divide-gray-50">
                {loading ? (
                    <div className="p-10 text-center text-gray-400 font-medium italic">Loading admins...</div>
                ) : admins.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 font-medium italic">No admins found.</div>
                ) : admins.map((admin) => (
                    <div key={admin._id} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-base md:text-lg ${admin.role === 'super-admin' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-gray-100 text-gray-400'}`}>
                                {admin.name?.charAt(0) || <FiUser />}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-black flex items-center gap-2 text-sm md:text-base truncate">
                                    {admin.name}
                                    {admin.role === 'super-admin' && <span className="text-[8px] font-black bg-red-600 text-white px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0">Super</span>}
                                </p>
                                <p className="text-[10px] md:text-xs font-medium text-gray-400 flex items-center gap-1 truncate"><FiMail size={10} /> {admin.email}</p>
                            </div>
                        </div>
                        {admin.email !== user?.email && (
                            <button 
                                onClick={() => handleRemoveAdmin(admin._id)}
                                className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
