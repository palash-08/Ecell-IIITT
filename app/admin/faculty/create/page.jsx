'use client';

import React, { useState } from 'react';
import { FiArrowLeft, FiSave, FiUpload, FiUser, FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiMulti } from '@/lib/api';

export default function CreateFacultyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Faculty Advisor',
    message: '',
    email: '',
    linkedin: '',
    image: null,
    imagePreview: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size exceeds 5MB limit');
        e.target.value = '';
        return;
      }
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('message', formData.message);
      data.append('email', formData.email);
      data.append('linkedin', formData.linkedin);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await apiMulti.post('/faculty', data);
      router.push('/admin/faculty');
    } catch (err) {
      console.error('Error creating faculty:', err);
      setError(err.response?.data?.error || 'Failed to add faculty member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/faculty" className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors mb-4 no-underline">
          <FiArrowLeft />
          Back to Faculty
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-2">Add Faculty Advisor</h1>
            <p className="text-gray-500 font-medium text-lg">Add a new faculty advisor and their message to the About page.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Image Upload */}
            <div className="md:col-span-2 flex flex-col items-center justify-center">
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 w-full text-left">Profile Picture</label>
               <div 
                onClick={() => document.getElementById('image-upload').click()}
                className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB800] hover:bg-[#FFB800]/5 transition-all overflow-hidden relative group"
               >
                 {formData.imagePreview ? (
                   <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <>
                     <FiUser size={40} className="text-gray-300 mb-2" />
                     <span className="text-[10px] font-bold text-gray-400">Click to Upload</span>
                   </>
                 )}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <FiUpload size={24} />
                 </div>
                 <input 
                   id="image-upload"
                   type="file" 
                   accept="image/*"
                   onChange={handleImageChange}
                   className="hidden" 
                 />
               </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Dr. Jane Smith" 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Role / Designation</label>
              <input 
                type="text" 
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="e.g. Faculty Advisor" 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="faculty@iiitt.ac.in" 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">LinkedIn Profile</label>
              <input 
                type="url" 
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                placeholder="https://linkedin.com/in/..." 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Advisor's Message</label>
                <span className="text-[10px] font-bold text-gray-400">{(formData.message || '').length}/1000</span>
              </div>
              <textarea 
                rows={6} 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Write the message that will appear on the About page..." 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-bold text-black resize-none"
                maxLength={1000}
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#FFB800] hover:text-black transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave size={20} />}
              {loading ? 'Saving...' : 'Save Faculty Member'}
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-8 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
          
          {error && <p className="mt-6 text-red-500 font-bold bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-2"><FiInfo /> {error}</p>}
        </div>
      </form>
    </div>
  );
}
