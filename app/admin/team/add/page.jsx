'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiUpload, FiUser, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiMulti } from '@/lib/api';

export default function AddTeamMemberPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'Core';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [memberData, setMemberData] = useState({
    name: '',
    role: '',
    category: initialType,
    company: '',
    batch: '',
    linkedin: '',
    email: '',
    formerPosition: '',
    image: null,
    imagePreview: null
  });

  const categories = ['Core', 'Technical', 'PR & Marketing', 'Events', 'Alumni'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberData({
        ...memberData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!memberData.name || !memberData.role || !memberData.category || !memberData.email) {
        setErrors({ submit: "Name, Role, Category, and Email are required." });
        setLoading(false);
        return;
    }

    try {
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('role', memberData.role);
      formData.append('category', memberData.category);
      formData.append('linkedin', memberData.linkedin);
      formData.append('email', memberData.email);
      
      if (memberData.category === 'Alumni') {
        formData.append('company', memberData.company);
        formData.append('batch', memberData.batch);
        formData.append('formerPosition', memberData.formerPosition);
        formData.append('active', 'false');
      } else {
        formData.append('active', 'true');
      }

      if (memberData.image) {
        formData.append('image', memberData.image);
      }

      await apiMulti.post('/team', formData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push(memberData.category === 'Alumni' ? '/admin/alumni' : '/admin/team');
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ submit: err.response?.data?.error || 'Failed to add member.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-black mb-2">Member Added!</h2>
        <p className="text-gray-500 font-medium">Redirecting you...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors mb-4"
        >
          <FiArrowLeft />
          Back
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-2">Add New Member</h1>
            <p className="text-gray-500 font-medium text-lg">Enter member details and profile information.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-[#FFB800] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#e6a700] transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <FiSave size={20} />}
            {loading ? 'Saving...' : 'Add Member'}
          </button>
        </div>
        {errors.submit && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{errors.submit}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name *</label>
                  <input 
                    type="text" 
                    value={memberData.name}
                    onChange={(e) => setMemberData({...memberData, name: e.target.value})}
                    placeholder="e.g. Ananya Sharma" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Role *</label>
                    <input 
                      type="text" 
                      value={memberData.role}
                      onChange={(e) => setMemberData({...memberData, role: e.target.value})}
                      placeholder="e.g. President" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category *</label>
                    <select 
                      value={memberData.category}
                      onChange={(e) => setMemberData({...memberData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {memberData.category === 'Alumni' && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Current Company</label>
                      <input 
                        type="text" 
                        value={memberData.company}
                        onChange={(e) => setMemberData({...memberData, company: e.target.value})}
                        placeholder="e.g. Google" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Batch (Year)</label>
                      <input 
                        type="text" 
                        value={memberData.batch}
                        onChange={(e) => setMemberData({...memberData, batch: e.target.value})}
                        placeholder="e.g. 2022" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
                      />
                    </div>
                  </div>
                )}

                {memberData.category === 'Alumni' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Former Position in E-Cell</label>
                    <input 
                      type="text" 
                      value={memberData.formerPosition}
                      onChange={(e) => setMemberData({...memberData, formerPosition: e.target.value})}
                      placeholder="e.g. Technical Lead" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">LinkedIn URL</label>
                    <input 
                      type="url" 
                      value={memberData.linkedin}
                      onChange={(e) => setMemberData({...memberData, linkedin: e.target.value})}
                      placeholder="https://linkedin.com/..." 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address *</label>
                    <input 
                      type="email" 
                      value={memberData.email}
                      onChange={(e) => setMemberData({...memberData, email: e.target.value})}
                      placeholder="name@example.com" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
                    />
                  </div>
                </div>
            </div>
        </div>

        <div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Profile Picture</label>
                <div 
                  onClick={() => document.getElementById('profile-upload').click()}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-gray-200 mx-auto flex items-center justify-center cursor-pointer hover:border-[#FFB800] transition-all overflow-hidden relative group"
                >
                    {memberData.imagePreview ? (
                      <img src={memberData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={40} className="text-gray-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiUpload className="text-white" size={24} />
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 font-medium">Click to upload photo<br/>(Max 5MB)</p>
                <input 
                  id="profile-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
            </div>
        </div>
      </div>
    </div>
  );
}
