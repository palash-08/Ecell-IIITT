'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiCheckCircle } from 'react-icons/fi';
import { useRouter, useParams } from 'next/navigation';
import { apiMulti } from '@/lib/api';
import api from '@/lib/api';

// Import local components
import MemberBasicInfo from '@/components/admin/team/MemberBasicInfo';
import MemberProfessionalInfo from '@/components/admin/team/MemberProfessionalInfo';
import MemberImageUpload from '@/components/admin/team/MemberImageUpload';

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [memberData, setMemberData] = useState({
    name: '',
    role: '',
    category: 'Core',
    company: '',
    batch: '',
    linkedin: '',
    email: '',
    formerPosition: '',
    image: null,
    imagePreview: null
  });

  const categories = ['Core', 'Technical', 'PR & Marketing', 'Events', 'Alumni'];

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await api.get(`/team/${id}`);
        const data = res.data.data;
        const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/api$/, '');

        setMemberData({
          name: data.name || '',
          role: data.role || '',
          category: data.category || 'Core',
          company: data.company || '',
          batch: data.batch || '',
          linkedin: data.linkedin || '',
          email: data.email || '',
          formerPosition: data.formerPosition || '',
          image: data.image || null,
          imagePreview: data.image ? `${API_URL}${data.image}` : null
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching member:', err);
        setErrors({ fetch: 'Failed to load member data.' });
        setLoading(false);
      }
    };

    if (id) fetchMember();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrors({});

    if (!memberData.name || !memberData.role || !memberData.category || !memberData.email) {
        setErrors({ submit: "Name, Role, Category, and Email are required." });
        setSaving(false);
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
      }

      if (memberData.image instanceof File) {
        formData.append('image', memberData.image);
      }

      await apiMulti.put(`/team/${id}`, formData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push(memberData.category === 'Alumni' ? '/admin/alumni' : '/admin/team');
      }, 1500);
    } catch (err) {
      console.error('Update error:', err);
      setErrors({ submit: err.response?.data?.error || 'Failed to update member.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Member Data...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-black mb-2">Member Updated!</h2>
        <p className="text-gray-500 font-medium">Redirecting you...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors mb-4 no-underline focus:outline-none"
        >
          <FiArrowLeft /> Back
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-2">Edit Member</h1>
            <p className="text-gray-500 font-medium text-lg">Update profile information for {memberData.name}.</p>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={saving} 
            className="flex items-center gap-2 bg-[#FFB800] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#e6a700] transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <FiSave size={20} />}
            {saving ? 'Saving...' : 'Update Member'}
          </button>
        </div>
        {errors.submit && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{errors.submit}</p>}
        {errors.fetch && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{errors.fetch}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <div className="md:col-span-2 space-y-6">
          <MemberBasicInfo 
            memberData={memberData} 
            setMemberData={setMemberData} 
            categories={categories} 
          />
          <MemberProfessionalInfo 
            memberData={memberData} 
            setMemberData={setMemberData} 
          />
        </div>

        <div>
           <MemberImageUpload 
             imagePreview={memberData.imagePreview} 
             handleImageChange={handleImageChange} 
           />
        </div>
      </div>
    </div>
  );
}
