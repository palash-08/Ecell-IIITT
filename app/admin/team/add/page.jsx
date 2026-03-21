'use client';

import React, { useState } from 'react';
import { FiArrowLeft, FiSave, FiCheckCircle } from 'react-icons/fi';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiMulti } from '@/lib/api';

// Import local components
import MemberBasicInfo from '@/components/admin/team/MemberBasicInfo';
import MemberProfessionalInfo from '@/components/admin/team/MemberProfessionalInfo';
import MemberImageUpload from '@/components/admin/team/MemberImageUpload';

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
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, submit: 'Image size exceeds 5MB limit' }));
        e.target.value = '';
        return;
      }
      setMemberData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.submit;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors mb-4 focus:outline-none"
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
