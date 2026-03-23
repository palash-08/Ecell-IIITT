import React, { useState } from 'react';
import { FiUpload, FiX, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { apiMulti } from '@/lib/api';

export default function AddMediaModal({ setShowAddModal, fetchGallery, events }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState({
        mediaType: 'image',
        category: 'Flagship',
        event: '',
        media: null
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Increased to 30MB seamlessly matching all other places globally
            if (file.size > 30 * 1024 * 1024) {
                setError('Limit Reached (Maximum 30MB)');
                e.target.value = '';
                return;
            }
            const mediaType = file.type.startsWith('video') ? 'video' : 'image';
            setNewItem({ ...newItem, media: file, mediaType });
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            let itemTitle = 'General';
            if (newItem.event) {
                const selectedEvent = events.find(ev => ev._id === newItem.event);
                if (selectedEvent) itemTitle = selectedEvent.title;
            }

            const formData = new FormData();
            formData.append('title', itemTitle);
            formData.append('mediaType', newItem.mediaType);
            formData.append('category', newItem.category);
            if (newItem.event) formData.append('event', newItem.event);
            formData.append('media', newItem.media);

            await apiMulti.post('/gallery', formData);
            setShowAddModal(false);
            fetchGallery();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload media');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
            >
                <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xl md:text-2xl font-black text-black">Add <span className="text-[#FFB800]">Media.</span></h3>
                    <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"><FiX size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 md:space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                            <select 
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="Flagship">Flagship</option>
                                <option value="Hackathon">Hackathon</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Link to Event (Optional)</label>
                            <select 
                                value={newItem.event}
                                onChange={(e) => setNewItem({ ...newItem, event: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="">None / General</option>
                                {events.map(ev => (
                                    <option key={ev._id} value={ev._id}>{ev.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Upload File</label>
                        <label className="flex items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all font-medium overflow-hidden">
                            {newItem.media ? <FiCheckCircle className="text-green-500 shrink-0" /> : <FiUpload className="text-[#FFB800] shrink-0" />}
                            <span className="text-gray-500 text-sm truncate">{newItem.media ? newItem.media.name : 'Choose File (Max 30MB)'}</span>
                            <input 
                                type="file" 
                                required
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                                className="hidden" 
                            />
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                    <button 
                        type="submit"
                        disabled={submitting || !newItem.media}
                        className="w-full bg-black text-white font-black py-4 md:py-5 rounded-2xl hover:bg-[#FFB800] hover:text-black transition-all shadow-xl uppercase tracking-widest text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {submitting ? 'Uploading...' : 'Save Media'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
