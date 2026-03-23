'use client';

import React, { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { apiMulti } from '@/lib/api';
import api from '@/lib/api';

import AdminHeader from '@/components/admin/shared/AdminHeader';
import AdminStatusBlock from '@/components/admin/shared/AdminStatusBlock';
import EventTabNavigation from '@/components/admin/events/EventTabNavigation';
import EventBasicDetails from '@/components/admin/events/EventBasicDetails';
import EventFormBuilder from '@/components/admin/events/EventFormBuilder';
import EventHighlights from '@/components/admin/events/EventHighlights';
import EventMediaGallery from '@/components/admin/events/EventMediaGallery';
import EventExternalLinks from '@/components/admin/events/EventExternalLinks';
import EventVisualPreview from '@/components/admin/events/EventVisualPreview';

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export default function EventEditorForm({ mode = 'create', eventId = null }) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

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
    existingGallery: [], 
    galleryPreviews: [], 
    highlights: isEdit ? [] : [
      { label: 'Expected Participants', value: '100+' },
      { label: 'Speaker Name', value: 'TBD' }
    ],
    externalLinks: isEdit ? [] : [
      { label: 'Registration Link', url: '' }
    ]
  });

  const [formFields, setFormFields] = useState(isEdit ? [] : [
    { id: 'name_sys', type: 'text', label: 'Full Name', required: true, systematic: true },
    { id: 'email_sys', type: 'email', label: 'Email Address', required: true, systematic: true },
  ]);

  useEffect(() => {
    if (isEdit && eventId) {
      const fetchEvent = async () => {
        try {
          const res = await api.get(`/events/${eventId}`);
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
            existingGallery: (data.galleryImages || []).map(img => typeof img === 'string' ? img : img.url),
            galleryPreviews: (data.galleryImages || []).map(img => {
              const url = typeof img === 'string' ? img : img.url;
              return {
                url: `${API_URL}${url}`,
                type: url.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image',
                isExisting: true,
                path: url
              };
            }),
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
      
      fetchEvent();
    }
  }, [isEdit, eventId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, submit: 'Limit Reached (Maximum 30MB)' }));
        e.target.value = '';
        return;
      }
      setEventDetails(prev => ({
        ...prev,
        mainImage: file,
        imagePreview: URL.createObjectURL(file)
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.submit;
        return newErrors;
      });
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.filter(file => file.size > MAX_FILE_SIZE);
    
    if (oversized.length > 0) {
      setErrors(prev => ({ ...prev, submit: 'Limit Reached (Maximum 30MB)' }));
      e.target.value = '';
      return;
    }

    const newFilesSize = files.reduce((acc, file) => acc + file.size, 0);
    const currentSize = eventDetails.galleryImages.reduce((acc, file) => acc + file.size, 0);
    
    if (currentSize + newFilesSize > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, submit: 'Total combined gallery size exceeds the 30MB limit.' }));
      e.target.value = '';
      return;
    }

    if (files.length > 0) {
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        isExisting: false
      }));
      setEventDetails(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...files],
        galleryPreviews: [...prev.galleryPreviews, ...newPreviews]
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.submit;
        return newErrors;
      });
    }
  };

  const removeGalleryImage = (index) => {
    setEventDetails(prev => {
      const previewToRemove = prev.galleryPreviews[index];
      const newPreviews = prev.galleryPreviews.filter((_, i) => i !== index);
      
      if (isEdit && previewToRemove.isExisting) {
        const newExisting = prev.existingGallery.filter(path => path !== previewToRemove.path);
        return {
          ...prev,
          existingGallery: newExisting,
          galleryPreviews: newPreviews
        };
      } else {
        const newImages = [...prev.galleryImages];
        // Calculate the actual index in the File array by ignoring existing previews
        const newIndex = prev.galleryPreviews.slice(0, index).filter(p => !p.isExisting).length;
        newImages.splice(newIndex, 1);
        
        return {
          ...prev,
          galleryImages: newImages,
          galleryPreviews: newPreviews
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
      
      if (eventDetails.mainImage instanceof File) {
        formData.append('mainImage', eventDetails.mainImage);
      } else if (typeof eventDetails.mainImage === 'string') {
        formData.append('mainImage', eventDetails.mainImage); // Mostly only useful if backend expects it
      }

      if (isEdit) {
        formData.append('galleryImagesPaths', JSON.stringify(eventDetails.existingGallery));
      }

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

      if (isEdit) {
        await apiMulti.put(`/events/${eventId}`, formData);
      } else {
        await apiMulti.post('/events', formData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/events');
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ submit: err.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} event. Please check your connection.` });
    } finally {
      setSaving(false);
    }
  };

  const currentGallerySize = eventDetails.galleryImages.reduce((acc, file) => acc + file.size, 0);
  const isGalleryLimitReached = currentGallerySize >= MAX_FILE_SIZE;

  if (loading) {
    return <AdminStatusBlock type="loading" message="Loading Event Data..." />;
  }

  if (success) {
    return (
      <AdminStatusBlock 
        type="success" 
        message={`Event ${isEdit ? 'Updated' : 'Created'}!`} 
        subMessage="Redirecting you to the events list..." 
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <AdminHeader 
        backLink="/admin/events"
        title={isEdit ? "Edit" : "Create New"}
        highlight="Event"
        description={isEdit ? "Update your event details and registration form." : "Set up your event details and customize the registration form."}
        actions={[
          {
            onClick: handleSubmit,
            disabled: saving,
            loading: saving,
            loadingLabel: "Saving...",
            icon: <FiSave size={20} />,
            label: isEdit ? "Update Event" : "Publish Event",
            variant: "primary"
          }
        ]}
      />
      {errors.submit && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{errors.submit}</p>}
      {errors.fetch && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{errors.fetch}</p>}

      <EventTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10 md:pb-20">
        <div className="lg:col-span-2">
          {activeTab === 'details' && (
            <EventBasicDetails 
              eventDetails={eventDetails} 
              setEventDetails={setEventDetails} 
            />
          )}

          {activeTab === 'form' && (
            <EventFormBuilder 
              formFields={formFields} 
              setFormFields={setFormFields} 
            />
          )}

          {activeTab === 'highlights' && (
            <EventHighlights 
              highlights={eventDetails.highlights} 
              setHighlights={(h) => setEventDetails(prev => ({ ...prev, highlights: h }))} 
            />
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <EventMediaGallery 
                galleryPreviews={eventDetails.galleryPreviews}
                onGalleryChange={handleGalleryChange}
                onRemoveImage={removeGalleryImage}
                isLimitReached={isGalleryLimitReached}
              />
              <EventExternalLinks 
                externalLinks={eventDetails.externalLinks}
                setExternalLinks={(l) => setEventDetails(prev => ({ ...prev, externalLinks: l }))}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <EventVisualPreview 
            eventDetails={eventDetails}
            formFields={formFields}
            onImageChange={handleImageChange}
          />
        </div>
      </div>
    </div>
  );
}
