'use client';

import React, { useState } from 'react';
import { FiArrowLeft, FiSave, FiUpload, FiSettings, FiLayout, FiPlus, FiTrash2, FiEye, FiCheckCircle, FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiMulti } from '@/lib/api';

export default function CreateEventPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Basic Event Details State
  const [eventDetails, setEventDetails] = useState({
    title: '',
    date: '',
    category: 'Flagship',
    venue: '',
    startTime: '',
    endTime: '',
    description: '',
    mainImage: null,
    imagePreview: null,
    galleryImages: [],
    galleryPreviews: [],
    highlights: [
      { label: 'Expected Participants', value: '500+' },
      { label: 'Speaker Name', value: 'TBD' }
    ],
    externalLinks: [
      { label: 'Registration Link', url: '' }
    ]
  });

  // Custom Form Builder State
  const [formFields, setFormFields] = useState([
    { id: 'name_sys', type: 'text', label: 'Full Name', required: true, systematic: true },
    { id: 'email_sys', type: 'email', label: 'Email Address', required: true, systematic: true },
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventDetails({
        ...eventDetails,
        mainImage: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      }));
      setEventDetails({
        ...eventDetails,
        galleryImages: [...eventDetails.galleryImages, ...files],
        galleryPreviews: [...eventDetails.galleryPreviews, ...newPreviews]
      });
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = [...eventDetails.galleryImages];
    const newPreviews = [...eventDetails.galleryPreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setEventDetails({
      ...eventDetails,
      galleryImages: newImages,
      galleryPreviews: newPreviews
    });
  };

  const addField = (type) => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      systematic: false,
      options: ['Option 1'],
      maxSize: 5, // Default 5MB
      fileType: 'image/*'
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(f => f.id !== id && !f.systematic));
  };

  const updateField = (id, updates) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addHighlight = () => {
    setEventDetails({
      ...eventDetails,
      highlights: [...eventDetails.highlights, { label: '', value: '' }]
    });
  };

  const removeHighlight = (index) => {
    const newHighlights = [...eventDetails.highlights];
    newHighlights.splice(index, 1);
    setEventDetails({
      ...eventDetails,
      highlights: newHighlights
    });
  };

  const updateHighlight = (index, updates) => {
    const newHighlights = [...eventDetails.highlights];
    newHighlights[index] = { ...newHighlights[index], ...updates };
    setEventDetails({
      ...eventDetails,
      highlights: newHighlights
    });
  };

  const addExternalLink = () => {
    setEventDetails({
      ...eventDetails,
      externalLinks: [...eventDetails.externalLinks, { label: '', url: '' }]
    });
  };

  const removeExternalLink = (index) => {
    const newLinks = [...eventDetails.externalLinks];
    newLinks.splice(index, 1);
    setEventDetails({
      ...eventDetails,
      externalLinks: newLinks
    });
  };

  const updateExternalLink = (index, updates) => {
    const newLinks = [...eventDetails.externalLinks];
    newLinks[index] = { ...newLinks[index], ...updates };
    setEventDetails({
      ...eventDetails,
      externalLinks: newLinks
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Simple validation
    if (!eventDetails.title || !eventDetails.date || !eventDetails.venue || !eventDetails.description) {
        setErrors({ submit: "Please fill all required basic details." });
        setLoading(false);
        return;
    }

    try {
      const formData = new FormData();
      formData.append('title', eventDetails.title);
      formData.append('date', eventDetails.date);
      formData.append('startTime', eventDetails.startTime);
      formData.append('endTime', eventDetails.endTime);
      formData.append('category', eventDetails.category);
      formData.append('venue', eventDetails.venue);
      formData.append('description', eventDetails.description);
      
      if (eventDetails.mainImage) {
        formData.append('mainImage', eventDetails.mainImage);
      }

      if (eventDetails.galleryImages.length > 0) {
        eventDetails.galleryImages.forEach(file => {
          formData.append('galleryImages', file);
        });
      }
      
      // Append the custom form schema as a JSON string
      formData.append('customFormSchema', JSON.stringify(formFields));
      
      // Filter and append highlights
      const filteredHighlights = eventDetails.highlights.filter(h => h.label.trim() && h.value.trim());
      formData.append('highlights', JSON.stringify(filteredHighlights));

      // Filter and append external links
      const filteredLinks = eventDetails.externalLinks.filter(l => l.label && l.label.trim() && l.url && l.url.trim());
      formData.append('externalLinks', JSON.stringify(filteredLinks));

      await apiMulti.post('/events', formData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/events');
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ submit: err.response?.data?.error || 'Failed to create event. Please check your connection.' });
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
        <h2 className="text-3xl font-extrabold text-black mb-2">Event Created!</h2>
        <p className="text-gray-500 font-medium">Redirecting you to the events list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/events" className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors mb-4 no-underline">
          <FiArrowLeft />
          Back to Events
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-2">Create New Event</h1>
            <p className="text-gray-500 font-medium text-lg">Set up your event details and customize the registration form.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-[#FFB800] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#e6a700] hover:-translate-y-0.5 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <FiSave size={20} />}
            {loading ? 'Saving...' : 'Publish Event'}
          </button>
        </div>
        {errors.submit && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{errors.submit}</p>}
      </div>

      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'details' ? 'border-[#FFB800] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <FiSettings /> Basic Details
        </button>
        <button 
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'form' ? 'border-[#FFB800] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <FiLayout /> Custom Registration Form
        </button>
        <button 
          onClick={() => setActiveTab('highlights')}
          className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'highlights' ? 'border-[#FFB800] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <FiInfo /> Event Highlights
        </button>
        <button 
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'media' ? 'border-[#FFB800] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <FiUpload /> Media & Links
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2">
          {activeTab === 'details' ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Event Title</label>
                    <span className="text-[10px] font-bold text-gray-400">{eventDetails.title.length}/200</span>
                  </div>
                  <input 
                    type="text" 
                    value={eventDetails.title}
                    onChange={(e) => setEventDetails({...eventDetails, title: e.target.value})}
                    placeholder="e.g. Global Entrepreneurship Summit" 
                    maxLength={200}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black"
                  required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Date</label>
                  <input 
                    type="date" 
                    value={eventDetails.date}
                    onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black text-sm uppercase"
                  required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Start Time</label>
                    <input 
                      type="time" 
                      value={eventDetails.startTime}
                      onChange={(e) => setEventDetails({...eventDetails, startTime: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">End Time</label>
                    <input 
                      type="time" 
                      value={eventDetails.endTime}
                      onChange={(e) => setEventDetails({...eventDetails, endTime: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category</label>
                  <select 
                    value={eventDetails.category}
                    onChange={(e) => setEventDetails({...eventDetails, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black appearance-none"
                  >
                    <option>Flagship</option>
                    <option>Hackathon</option>
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Venue / Platform</label>
                    <span className="text-[10px] font-bold text-gray-400">{eventDetails.venue.length}/200</span>
                  </div>
                  <input 
                    type="text" 
                    value={eventDetails.venue}
                    onChange={(e) => setEventDetails({...eventDetails, venue: e.target.value})}
                    placeholder="e.g. Auditorium / G-Meet Link" 
                    maxLength={200}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black"
                  required />
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
                    <span className="text-[10px] font-bold text-gray-400">{eventDetails.description.length}/1000</span>
                  </div>
                  <textarea 
                    rows={6} 
                    value={eventDetails.description}
                    onChange={(e) => setEventDetails({...eventDetails, description: e.target.value})}
                    placeholder="Describe the event, prizes, and schedule..." 
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black resize-none"
                  required></textarea>
                </div>
              </div>
            </div>
          ) : activeTab === 'form' ? (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center overflow-x-auto no-scrollbar">
                <p className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-tighter shrink-0">Add Field:</p>
                <div className="flex gap-2">
                  <button onClick={() => addField('text')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-lg font-bold text-xs transition-colors shrink-0 border border-gray-100">
                    <FiPlus /> Short Text
                  </button>
                  <button onClick={() => addField('textarea')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-lg font-bold text-xs transition-colors shrink-0 border border-gray-100">
                    <FiPlus /> Long Text
                  </button>
                  <button onClick={() => addField('number')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-lg font-bold text-xs transition-colors shrink-0 border border-gray-100">
                    <FiPlus /> Number
                  </button>
                  <button onClick={() => addField('radio')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-lg font-bold text-xs transition-colors shrink-0 border border-gray-100">
                    <FiPlus /> Single Choice
                  </button>
                  <button onClick={() => addField('checkbox')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-lg font-bold text-xs transition-colors shrink-0 border border-gray-100">
                    <FiPlus /> Multiple Choice
                  </button>
                  <button onClick={() => addField('file')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-lg font-bold text-xs transition-colors shrink-0 border border-gray-100">
                    <FiPlus /> File Upload
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {formFields.map((field) => (
                  <div key={field.id} className={`group bg-white border ${field.systematic ? 'border-amber-100 bg-amber-50/20' : 'border-gray-200'} rounded-2xl p-6 shadow-sm`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                         <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase">{field.type === 'radio' ? 'Single Choice' : field.type === 'checkbox' ? 'Multiple Choice' : field.type}</span>
                         {field.systematic && <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase"><FiSettings size={10} /> System Field</span>}
                      </div>
                      {!field.systematic && (
                        <button onClick={() => removeField(field.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Field Label</label>
                        <input 
                          type="text" 
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-bold text-black" 
                        />
                      </div>

                      {/* Options for Radio/Checkbox */}
                      {(field.type === 'radio' || field.type === 'checkbox') && (
                        <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Options</label>
                            <button 
                              onClick={() => {
                                const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                                updateField(field.id, { options: newOptions });
                              }}
                              className="text-[10px] font-bold text-[#FFB800] hover:underline"
                            >
                              + Add Option
                            </button>
                          </div>
                          <div className="space-y-2">
                            {field.options?.map((opt, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-3 h-3 border border-gray-300 ${field.type === 'radio' ? 'rounded-full' : 'rounded-sm'}`}></div>
                                <input 
                                  type="text" 
                                  value={opt}
                                  onChange={(e) => {
                                    const newOptions = [...field.options];
                                    newOptions[idx] = e.target.value;
                                    updateField(field.id, { options: newOptions });
                                  }}
                                  className="flex-1 bg-transparent text-sm font-medium focus:outline-none border-b border-transparent focus:border-gray-200"
                                />
                                {field.options.length > 1 && (
                                  <button 
                                    onClick={() => {
                                      const newOptions = field.options.filter((_, i) => i !== idx);
                                      updateField(field.id, { options: newOptions });
                                    }}
                                    className="text-gray-300 hover:text-red-500"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* File Upload Settings */}
                      {field.type === 'file' && (
                        <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Max Size (MB)</label>
                            <input 
                              type="number" 
                              value={field.maxSize || 5}
                              onChange={(e) => updateField(field.id, { maxSize: parseInt(e.target.value) })}
                              className="w-full bg-transparent border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-bold text-black text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">File Types</label>
                            <select 
                              value={field.fileType || 'image/*'}
                              onChange={(e) => updateField(field.id, { fileType: e.target.value })}
                              className="w-full bg-transparent border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-bold text-black text-sm"
                            >
                              <option value="image/*">Images Only</option>
                              <option value=".pdf">PDF Only</option>
                              <option value="image/*,.pdf">Images & PDF</option>
                              <option value="*/*">Any File</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-4 md:pt-0">
                         <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                               type="checkbox" 
                               checked={field.required}
                               onChange={(e) => updateField(field.id, { required: e.target.checked })}
                               className="w-4 h-4 accent-[#FFB800]" 
                            />
                            <span className="text-sm font-bold text-gray-700">Required Field</span>
                         </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'highlights' ? (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-black">Event Highlights</h3>
                    <p className="text-sm text-gray-500">Add cards to highlight key information about the event.</p>
                  </div>
                  <button 
                    onClick={addHighlight}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-xl font-bold text-sm transition-all border border-gray-100"
                  >
                    <FiPlus /> Add Highlight
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventDetails.highlights.map((highlight, index) => (
                    <div key={index} className="group bg-gray-50 border border-gray-100 rounded-xl p-4 transition-all hover:border-[#FFB800]/30 hover:bg-white relative">
                      <button 
                        onClick={() => removeHighlight(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                      >
                        <FiTrash2 size={12} />
                      </button>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Label</label>
                          <input 
                            type="text" 
                            value={highlight.label}
                            onChange={(e) => updateHighlight(index, { label: e.target.value })}
                            placeholder="e.g. Expected Participants"
                            className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-bold text-black text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Value</label>
                          <input 
                            type="text" 
                            value={highlight.value}
                            onChange={(e) => updateHighlight(index, { value: e.target.value })}
                            placeholder="e.g. 500+"
                            className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-medium text-gray-700 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {eventDetails.highlights.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-gray-400 font-medium">No highlights added yet.</p>
                    <button onClick={addHighlight} className="text-[#FFB800] font-bold hover:underline mt-2">+ Add your first highlight</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Media Gallery Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-black">Event Gallery</h3>
                    <p className="text-sm text-gray-500">Upload additional photos or media from past sessions or event teasers.</p>
                  </div>
                  <button 
                    onClick={() => document.getElementById('gallery-upload').click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-xl font-bold text-sm transition-all border border-gray-100"
                  >
                    <FiPlus /> Add Photos/Videos
                  </button>
                  <input 
                    id="gallery-upload"
                    type="file" 
                    multiple
                    accept="image/*,video/*"
                    onChange={handleGalleryChange}
                    className="hidden" 
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {eventDetails.galleryPreviews.map((preview, index) => (
                    <div key={index} className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      {preview.type === 'video' ? (
                        <video src={preview.url} className="w-full h-full object-cover" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                      ) : (
                        <img src={preview.url} alt="Gallery" className="w-full h-full object-cover" />
                      )}
                      <button 
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                  
                  <div 
                    onClick={() => document.getElementById('gallery-upload').click()}
                    className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB800] hover:bg-[#FFB800]/5 transition-all"
                  >
                    <FiUpload size={20} className="text-gray-300 mb-1" />
                    <span className="text-[10px] font-bold text-gray-400 capitalize">Upload More</span>
                  </div>
                </div>
              </div>

              {/* External Links Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-black">External Links</h3>
                    <p className="text-sm text-gray-500">Add useful links like registration forms, G-Meet links, or external resources.</p>
                  </div>
                  <button 
                    onClick={addExternalLink}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-xl font-bold text-sm transition-all border border-gray-100"
                  >
                    <FiPlus /> Add Link
                  </button>
                </div>

                <div className="space-y-4">
                  {eventDetails.externalLinks.map((link, index) => (
                    <div key={index} className="group flex flex-col md:flex-row gap-4 items-end bg-gray-50 border border-gray-100 rounded-xl p-4 transition-all hover:border-[#FFB800]/30 hover:bg-white relative">
                      <button 
                        onClick={() => removeExternalLink(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                      >
                        <FiTrash2 size={12} />
                      </button>
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Link Label <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={link.label}
                          onChange={(e) => updateExternalLink(index, { label: e.target.value })}
                          placeholder="e.g. Registration Form"
                          className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-bold text-black text-sm"
                        />
                      </div>
                      <div className="flex-[2] w-full">
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">URL <span className="text-red-500">*</span></label>
                        <input 
                          type="url" 
                          value={link.url}
                          onChange={(e) => updateExternalLink(index, { url: e.target.value })}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-medium text-gray-700 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {eventDetails.externalLinks.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                       <p className="text-gray-400 text-sm">No external links added.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
      </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider flex items-center gap-2">
              <FiEye className="text-[#FFB800]" /> Visual Preview
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">Event Poster</label>
              <div 
                onClick={() => document.getElementById('poster-upload').click()}
                className="w-full aspect-[4/3] bg-white border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB800] hover:bg-[#FFB800]/5 transition-all overflow-hidden"
              >
                {eventDetails.imagePreview ? (
                  <img src={eventDetails.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <FiUpload size={24} className="text-gray-300 mb-2" />
                    <span className="text-xs font-bold text-gray-400">Click to Upload</span>
                  </>
                )}
                <input 
                  id="poster-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </div>

              {eventDetails.galleryPreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest border-b border-gray-100 pb-1">Gallery Preview ({eventDetails.galleryPreviews.length} items)</p>
                  <div className="grid grid-cols-4 gap-2">
                    {eventDetails.galleryPreviews.slice(0, 4).map((preview, i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded-md overflow-hidden relative border border-gray-200">
                        {preview.type === 'video' ? (
                          <video src={preview.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={preview.url} alt="" className="w-full h-full object-cover" />
                        )}
                        {i === 3 && eventDetails.galleryPreviews.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold">
                            +{eventDetails.galleryPreviews.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Registration Form Preview</p>
              {formFields.map(field => (
                <div key={field.id}>
                  <p className="text-xs font-bold text-gray-600 mb-1.5">{field.label} {field.required && <span className="text-red-500">*</span>}</p>
                  
                  {field.type === 'radio' ? (
                    <div className="space-y-1.5 ml-1">
                      {field.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-gray-200 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-500">{opt}</span>
                        </div>
                      ))}
                    </div>
                  ) : field.type === 'checkbox' ? (
                    <div className="space-y-1.5 ml-1">
                      {field.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-gray-200 rounded-sm"></div>
                          <span className="text-xs font-medium text-gray-500">{opt}</span>
                        </div>
                      ))}
                    </div>
                  ) : field.type === 'file' ? (
                    <div className="h-10 w-full bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2">
                       <FiUpload size={14} className="text-gray-300" />
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Upload File (Max {field.maxSize}MB)</span>
                    </div>
                  ) : (
                    <div className="h-10 w-full bg-gray-50 border border-gray-100 rounded-lg"></div>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <div className="w-full h-11 bg-black rounded-xl cursor-not-allowed opacity-10"></div>
              </div>
              <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
                 <FiInfo className="text-amber-500 mt-1 shrink-0" size={14} />
                 <p className="text-[10px] font-medium text-amber-700 leading-normal">
                   Verify all fields before publishing. The registration form will be live immediately for this event.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
