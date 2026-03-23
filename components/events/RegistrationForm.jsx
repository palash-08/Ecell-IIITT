'use client';

import React, { useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiLock } from 'react-icons/fi';
import { apiMulti } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegistrationForm({ eventId, schema }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  const handleChange = (label, value, type) => {
    if (type === 'checkbox') {
      const current = formData[label] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setFormData({ ...formData, [label]: updated });
    } else {
      setFormData({ ...formData, [label]: value });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('eventId', eventId);
      data.append('formData', JSON.stringify(formData));

      await apiMulti.post('/registrations', data);
      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-3xl p-12 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-black text-black mb-2">Registration Successful!</h3>
        <p className="text-gray-600 font-medium">We've received your application. See you at the event!</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiLock size={32} />
        </div>
        <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">Login <span className="text-[#FFB800]">Required</span></h3>
        <p className="text-gray-500 font-medium mb-8">You need to be logged in to register for this event.</p>
        <div className="flex justify-center">
          <Link 
            href="/login"
            className="inline-block bg-[#FFB800] hover:bg-[#e6a600] text-black font-black py-4 px-10 rounded-2xl shadow-xl shadow-[#FFB800]/10 transition-all uppercase tracking-widest text-sm"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
      <h3 className="text-2xl font-black text-black mb-6 uppercase tracking-tight">Register <span className="text-[#FFB800]">Now</span></h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {schema.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                onBlur={(e) => handleChange(field.label, e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-medium min-h-[100px]"
              />
            ) : field.type === 'radio' ? (
              <div className="space-y-2 mt-2">
                {field.options?.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name={field.id}
                      required={field.required}
                      onChange={() => handleChange(field.label, opt)}
                      className="w-4 h-4 accent-[#FFB800]"
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            ) : field.type === 'checkbox' ? (
              <div className="space-y-2 mt-2">
                {field.options?.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      onChange={() => handleChange(field.label, opt, 'checkbox')}
                      className="w-4 h-4 accent-[#FFB800]"
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                onBlur={(e) => handleChange(field.label, e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all font-medium"
              />
            )}
          </div>
        ))}
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 p-4 rounded-xl border border-red-100">
            <FiAlertCircle className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#FFB800] hover:text-black transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}
