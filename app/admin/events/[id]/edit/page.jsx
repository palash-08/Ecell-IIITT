'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiUpload, FiSettings, FiLayout, FiPlus, FiTrash2, FiEye, FiCheckCircle, FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { apiMulti } from '@/lib/api';
import api from '@/lib/api';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    galleryImages: [], // This will only store NEWLY added files
    existingGallery: [], // This stores existing relative paths from DB
    galleryPreviews: [], // Combined previews (URLs + New ObjectURLs)
    highlights: [],
    externalLinks: []
  });

  // Custom Form Builder State
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const data = res.data.data;
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

        setEventDetails({
          title: data.title || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          category: data.category || 'Flagship',
          venue: data.venue || '',
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          description: data.description || '',
          mainImage: data.mainImage || null,
          imagePreview: data.mainImage ? `${API_URL}${data.mainImage}` : null,
          galleryImages: [], 
          existingGallery: data.galleryImages || [],
          galleryPreviews: (data.galleryImages || []).map(path => ({
            url: `${API_URL}${path}`,
            type: path.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image',
            isExisting: true,
            path: path
          })),
          highlights: data.highlights || [],
          externalLinks: data.externalLinks || []
        });

        setFormFields(data.customFormSchema || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
        setErrors({ fetch: 'Failed to load event data.' });
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

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
        type: file.type.startsWith('video/') ? 'video' : 'image',
        isExisting: false
      }));
      setEventDetails({
        ...eventDetails,
        galleryImages: [...eventDetails.galleryImages, ...files],
        galleryPreviews: [...eventDetails.galleryPreviews, ...newPreviews]
      });
    }
  };

  const removeGalleryImage = (index) => {
    const previewToRemove = eventDetails.galleryPreviews[index];
    const newPreviews = eventDetails.galleryPreviews.filter((_, i) => i !== index);
    
    if (previewToRemove.isExisting) {
      // It was an existing image
      const newExisting = eventDetails.existingGallery.filter(path => path !== previewToRemove.path);
      setEventDetails({
        ...eventDetails,
        existingGallery: newExisting,
        galleryPreviews: newPreviews
      });
    } else {
      // It was a newly added file
      // We need to find its index in the galleryImages array
      // This is slightly tricky since it's not a 1:1 map if there are mixed existing/new
      const newImages = [...eventDetails.galleryImages];
      // Find the relative index of the new image
      const newIndex = eventDetails.galleryPreviews.slice(0, index).filter(p => !p.isExisting).length;
      newImages.splice(newIndex, 1);
      
      setEventDetails({
        ...eventDetails,
        galleryImages: newImages,
        galleryPreviews: newPreviews
      });
    }
  };

  const addField = (type) => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      systematic: false,
      options: type === 'radio' || type === 'checkbox' ? ['Option 1'] : undefined,
      maxSize: type === 'file' ? 5 : undefined,
      fileType: type === 'file' ? 'image/*' : undefined
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
    setEventDetails({ ...eventDetails, highlights: newHighlights });
  };

  const updateHighlight = (index, updates) => {
    const newHighlights = [...eventDetails.highlights];
    newHighlights[index] = { ...newHighlights[index], ...updates };
    setEventDetails({ ...eventDetails, highlights: newHighlights });
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
    setEventDetails({ ...eventDetails, externalLinks: newLinks });
  };

  const updateExternalLink = (index, updates) => {
    const newLinks = [...eventDetails.externalLinks];
    newLinks[index] = { ...newLinks[index], ...updates };
    setEventDetails({ ...eventDetails, externalLinks: newLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    if (!eventDetails.title || !eventDetails.date || !eventDetails.venue || !eventDetails.description) {
      setErrors({ submit: "Please fill all required basic details." });
      setSaving(false);
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
      
      // Handle Main Image: Send as File if updated, otherwise backend keeps existing or handles if string
      if (eventDetails.mainImage instanceof File) {
        formData.append('mainImage', eventDetails.mainImage);
      } else if (typeof eventDetails.mainImage === 'string') {
        formData.append('mainImage', eventDetails.mainImage);
      }

      // Handle Existing Gallery (paths) - Send as JSON string for the backend to know what to keep
      formData.append('galleryImagesPaths', JSON.stringify(eventDetails.existingGallery));

      // Handle New Gallery Images
      if (eventDetails.galleryImages.length > 0) {
        eventDetails.galleryImages.forEach(file => {
          formData.append('galleryImages', file);
        });
      }
      
      formData.append('customFormSchema', JSON.stringify(formFields));
      
      const filteredHighlights = eventDetails.highlights.filter(h => h.label.trim() && h.value.trim());
      formData.append('highlights', JSON.stringify(filteredHighlights));

      const filteredLinks = eventDetails.externalLinks.filter(l => l.label && l.label.trim() && l.url && l.url.trim());
      formData.append('externalLinks', JSON.stringify(filteredLinks));

      await apiMulti.put(`/events/${id}`, formData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/events');
      }, 1500);
    } catch (err) {
      console.error('Update error:', err);
      setErrors({ submit: err.response?.data?.error || 'Failed to update event. Please check your connection.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Loading Event Data...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-black mb-2">Event Updated!</h2>
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
            <h1 className="text-3xl font-extrabold text-black mb-2">Edit Event</h1>
            <p className="text-gray-500 font-medium text-lg">Update your event details and registration form.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-[#FFB800] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#e6a700] hover:-translate-y-0.5 transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <FiSave size={20} />}
            {saving ? 'Saving...' : 'Update Event'}
          </button>
        </div>
        {errors.submit && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{errors.submit}</p>}
      </div>

      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('details')} className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'details' ? 'border-[#FFB800] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><FiSettings /> Basic Details</button>
        <button onClick={() => setActiveTab('form')} className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'form' ? 'border-[#FFB800] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><FiLayout /> Registration Form</button>
        <button onClick={() => setActiveTab('highlights')} className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'highlights' ? 'border-[#FFB800] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><FiInfo /> Highlights</button>
        <button onClick={() => setActiveTab('media')} className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'media' ? 'border-[#FFB800] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><FiUpload /> Media & Links</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2">
          {activeTab === 'details' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Event Title</label>
                    <span className="text-[10px] font-bold text-gray-400">{(eventDetails.title || '').length}/200</span>
                  </div>
                  <input type="text" value={eventDetails.title} onChange={(e) => setEventDetails({...eventDetails, title: e.target.value})} maxLength={200} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Date</label>
                  <input type="date" value={eventDetails.date} onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Start Time</label>
                    <input type="time" value={eventDetails.startTime} onChange={(e) => setEventDetails({...eventDetails, startTime: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">End Time</label>
                    <input type="time" value={eventDetails.endTime} onChange={(e) => setEventDetails({...eventDetails, endTime: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category</label>
                  <select value={eventDetails.category} onChange={(e) => setEventDetails({...eventDetails, category: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                    <option>Flagship</option><option>Hackathon</option><option>Workshop</option><option>Seminar</option><option>Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Venue / Platform</label>
                    <span className="text-[10px] font-bold text-gray-400">{(eventDetails.venue || '').length}/200</span>
                  </div>
                  <input type="text" value={eventDetails.venue} onChange={(e) => setEventDetails({...eventDetails, venue: e.target.value})} maxLength={200} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
                    <span className="text-[10px] font-bold text-gray-400">{(eventDetails.description || '').length}/1000</span>
                  </div>
                  <textarea rows={6} value={eventDetails.description} onChange={(e) => setEventDetails({...eventDetails, description: e.target.value})} maxLength={1000} className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'form' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center overflow-x-auto no-scrollbar">
                <p className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-tighter shrink-0">Add Field:</p>
                <div className="flex gap-2">
                  {['text', 'textarea', 'number', 'radio', 'checkbox', 'file'].map(type => (
                    <button key={type} onClick={() => addField(type)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-lg font-bold text-xs border border-gray-100 transition-colors capitalize">
                      <FiPlus /> {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {formFields.map((field) => (
                  <div key={field.id} className={`bg-white border ${field.systematic ? 'border-amber-100 bg-amber-50/20' : 'border-gray-200'} rounded-2xl p-6`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase">{field.type}</span>
                      {!field.systematic && <button onClick={() => removeField(field.id)} className="text-gray-300 hover:text-red-500"><FiTrash2 size={18} /></button>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Field Label</label>
                        <input type="text" value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} className="w-full border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-bold" />
                      </div>
                      {(field.type === 'radio' || field.type === 'checkbox') && (
                        <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-bold text-gray-500">OPTIONS</label>
                            <button onClick={() => updateField(field.id, { options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })} className="text-[10px] font-bold text-[#FFB800] hover:underline">+ ADD</button>
                          </div>
                          {field.options?.map((opt, idx) => (
                            <div key={idx} className="flex gap-2 mb-1">
                              <input type="text" value={opt} onChange={(e) => {
                                const newOpts = [...field.options]; newOpts[idx] = e.target.value;
                                updateField(field.id, { options: newOpts });
                              }} className="flex-1 bg-transparent text-xs border-b border-gray-100" />
                              <button onClick={() => updateField(field.id, { options: field.options.filter((_, i) => i !== idx) })} className="text-gray-300 hover:text-red-500"><FiTrash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      {field.type === 'file' && (
                        <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                           <input type="number" value={field.maxSize || 5} onChange={(e) => updateField(field.id, { maxSize: parseInt(e.target.value) })} className="bg-transparent border-b border-gray-200 text-xs" placeholder="Max Size (MB)" />
                           <select value={field.fileType || 'image/*'} onChange={(e) => updateField(field.id, { fileType: e.target.value })} className="bg-transparent border-b border-gray-200 text-xs">
                             <option value="image/*">Images</option><option value=".pdf">PDF</option><option value="*/*">Any</option>
                           </select>
                        </div>
                      )}
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })} className="accent-[#FFB800]" /><span className="text-xs font-bold">Required Field</span></label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold">Highlights</h3>
                 <button onClick={addHighlight} className="text-xs font-bold bg-[#FFB800] px-3 py-1.5 rounded-lg">+ Add</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {eventDetails.highlights.map((h, i) => (
                   <div key={i} className="bg-gray-50 p-4 rounded-xl relative group">
                     <button onClick={() => removeHighlight(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><FiTrash2 size={14} /></button>
                     <input type="text" value={h.label} onChange={(e) => updateHighlight(i, { label: e.target.value })} placeholder="Label" className="w-full bg-transparent border-b border-gray-200 text-sm font-bold mb-2" />
                     <input type="text" value={h.value} onChange={(e) => updateHighlight(i, { value: e.target.value })} placeholder="Value" className="w-full bg-transparent border-b border-gray-200 text-xs" />
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
               <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold">Gallery</h3>
                   <button onClick={() => document.getElementById('gallery-upload').click()} className="text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">+ Add</button>
                   <input id="gallery-upload" type="file" multiple accept="image/*,video/*" onChange={handleGalleryChange} className="hidden" />
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {eventDetails.galleryPreviews.map((p, i) => (
                     <div key={i} className="relative aspect-video rounded-xl overflow-hidden border">
                       {p.type === 'video' ? <video src={p.url} className="w-full h-full object-cover" /> : <img src={p.url} className="w-full h-full object-cover" />}
                       <button onClick={() => removeGalleryImage(i)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"><FiTrash2 size={10} /></button>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="bg-white border border-gray-200 rounded-2xl p-8">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold">External Links</h3>
                   <button onClick={addExternalLink} className="text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">+ Add</button>
                 </div>
                 <div className="space-y-3">
                   {eventDetails.externalLinks.map((l, i) => (
                     <div key={i} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl relative group">
                        <button onClick={() => removeExternalLink(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><FiTrash2 size={14} /></button>
                        <div className="flex-1">
                           <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Label <span className="text-red-500">*</span></label>
                           <input type="text" value={l.label} onChange={(e) => updateExternalLink(i, { label: e.target.value })} placeholder="Label" className="w-full bg-transparent border-b border-gray-200 text-xs font-bold" />
                        </div>
                        <div className="flex-[2]">
                           <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">URL <span className="text-red-500">*</span></label>
                           <input type="url" value={l.url} onChange={(e) => updateExternalLink(i, { url: e.target.value })} placeholder="URL" className="w-full bg-transparent border-b border-gray-200 text-xs" />
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-bold border-b border-gray-100 pb-2 mb-4 uppercase tracking-widest flex items-center gap-2"><FiEye className="text-[#FFB800]" /> Visual Preview</h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6 relative group overflow-hidden cursor-pointer" onClick={() => document.getElementById('poster-upload').click()}>
              {eventDetails.imagePreview ? <img src={eventDetails.imagePreview} className="w-full aspect-[4/3] object-cover rounded-lg" /> : <div className="w-full aspect-[4/3] border-2 border-dashed flex flex-col items-center justify-center text-gray-300"><FiUpload size={24} /></div>}
              <input id="poster-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            <div className="space-y-4">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fields Preview</p>
               {formFields.map(f => (
                 <div key={f.id} className="text-xs">
                   <p className="font-bold text-gray-600 mb-1">{f.label} {f.required && '*'}</p>
                   <div className="h-8 bg-gray-50 border border-gray-100 rounded-lg"></div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
