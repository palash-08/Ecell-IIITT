'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiImage, FiVideo, FiUpload, FiX, FiCheckCircle, FiGrid } from 'react-icons/fi';
import api, { apiMulti } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminGalleryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    
    const [newItem, setNewItem] = useState({
        title: '',
        mediaType: 'image',
        category: 'Flagship',
        event: '',
        media: null
    });

    const fetchGallery = async () => {
        try {
            const res = await api.get('/gallery');
            setItems(res.data.data);
        } catch (err) {
            console.error('Error fetching gallery:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data.data);
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        };
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const mediaType = file.type.startsWith('video') ? 'video' : 'image';
            setNewItem({ ...newItem, media: file, mediaType });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('title', newItem.title);
            formData.append('mediaType', newItem.mediaType);
            formData.append('category', newItem.category);
            if (newItem.event) formData.append('event', newItem.event);
            formData.append('media', newItem.media);

            await apiMulti.post('/gallery', formData);
            setShowAddModal(false);
            setNewItem({ title: '', mediaType: 'image', category: 'Flagship', event: '', media: null });
            fetchGallery();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload media');
        } finally {
            setSubmitting(false);
        }
    };

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/api$/, '');

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-black mb-2">Media <span className="text-[#FFB800]">Gallery.</span></h1>
                    <p className="text-gray-500 font-medium text-lg">Manage photos and videos across all events.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black hover:bg-[#FFB800] hover:text-black transition-all shadow-xl uppercase tracking-widest text-sm"
                >
                    <FiPlus size={20} />
                    Add Media
                </button>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading gallery...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-[3rem] p-20 text-center">
                    <FiGrid className="mx-auto text-gray-200 mb-8" size={64} />
                    <h3 className="text-2xl font-black text-black mb-2">No Media Found</h3>
                    <p className="text-gray-500 font-medium mb-8">Start by adding your first photo or video!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group relative">
                            <div className="aspect-square relative flex items-center justify-center bg-gray-50">
                                {item.mediaType === 'image' ? (
                                    <img 
                                        src={`${API_URL}${item.url}`} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                ) : (
                                    <div className="w-full h-full relative">
                                        <video 
                                            src={`${API_URL}${item.url}`} 
                                            className="w-full h-full object-cover" 
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <FiVideo className="text-white" size={40} />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                                    <button 
                                        onClick={() => handleDelete(item._id)}
                                        className="self-end p-3 bg-red-600/20 text-white rounded-xl hover:bg-red-600 transition-all backdrop-blur-md"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                    <div>
                                        <span className="px-3 py-1 bg-[#FFB800] text-black text-[10px] font-black rounded-full uppercase tracking-widest mb-2 inline-block">
                                            {item.category}
                                        </span>
                                        <h4 className="text-white font-black text-lg line-clamp-2">{item.title}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Media Modal */}
            <AnimatePresence>
                {showAddModal && (
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
                            className="relative w-full max-w-xl bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-black">Add <span className="text-[#FFB800]">Media.</span></h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FiX size={24} /></button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Media Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newItem.title}
                                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                        placeholder="e.g. E-Summit 2024 Day 1"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] transition-all font-medium"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                                        <select 
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] transition-all font-medium appearance-none"
                                        >
                                            <option value="Flagship">Flagship</option>
                                            <option value="Hackathon">Hackathon</option>
                                            <option value="Workshop">Workshop</option>
                                            <option value="Seminar">Seminar</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Link to Event (Optional)</label>
                                        <select 
                                            value={newItem.event}
                                            onChange={(e) => setNewItem({ ...newItem, event: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] transition-all font-medium appearance-none"
                                        >
                                            <option value="">None / General</option>
                                            {events.map(ev => (
                                                <option key={ev._id} value={ev._id}>{ev.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Upload File</label>
                                        <label className="flex items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all font-medium overflow-hidden">
                                            {newItem.media ? <FiCheckCircle className="text-green-500 shrink-0" /> : <FiUpload className="text-[#FFB800] shrink-0" />}
                                            <span className="text-gray-500 text-sm truncate">{newItem.media ? newItem.media.name : 'Choose File'}</span>
                                            <input 
                                                type="file" 
                                                required
                                                onChange={handleFileChange}
                                                accept="image/*,video/*"
                                                className="hidden" 
                                            />
                                        </label>
                                    </div>
                                </div>
                                </div>

                                {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                                <button 
                                    type="submit"
                                    disabled={submitting || !newItem.media}
                                    className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-[#FFB800] hover:text-black transition-all shadow-xl uppercase tracking-widest text-sm disabled:opacity-50"
                                >
                                    {submitting ? 'Uploading...' : 'Save Media'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
