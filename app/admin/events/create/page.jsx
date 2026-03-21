'use client';

import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { apiMulti } from '@/lib/api';
import api from '@/lib/api';

// Import shared and local components
import AdminHeader from '@/components/admin/shared/AdminHeader';
import AdminStatusBlock from '@/components/admin/shared/AdminStatusBlock';

// Import local components
import EventTabNavigation from '@/components/admin/events/EventTabNavigation';
import EventBasicDetails from '@/components/admin/events/EventBasicDetails';
import EventFormBuilder from '@/components/admin/events/EventFormBuilder';
import EventHighlights from '@/components/admin/events/EventHighlights';
import EventMediaGallery from '@/components/admin/events/EventMediaGallery';
import EventExternalLinks from '@/components/admin/events/EventExternalLinks';
import EventVisualPreview from '@/components/admin/events/EventVisualPreview';

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
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, submit: 'Main image size exceeds 5MB limit' }));
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
    const oversized = files.filter(file => file.size > 5 * 1024 * 1024);
    
    if (oversized.length > 0) {
      setErrors(prev => ({ ...prev, submit: `${oversized.length} file(s) exceed the 5MB limit.` }));
      e.target.value = '';
      return;
    }

    if (files.length > 0) {
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
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
      const newImages = [...prev.galleryImages];
      const newPreviews = [...prev.galleryPreviews];
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      return {
        ...prev,
        galleryImages: newImages,
        galleryPreviews: newPreviews
      };
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
      
      formData.append('customFormSchema', JSON.stringify(formFields));
      
      const filteredHighlights = eventDetails.highlights.filter(h => h.label.trim() && h.value.trim());
      formData.append('highlights', JSON.stringify(filteredHighlights));

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
      <AdminStatusBlock 
        type="success" 
        message="Event Created!" 
        subMessage="Redirecting you to the events list..." 
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <AdminHeader 
        backLink="/admin/events"
        title="Create New"
        highlight="Event"
        description="Set up your event details and customize the registration form."
        actions={[
          {
            onClick: handleSubmit,
            disabled: loading,
            loading: loading,
            loadingLabel: "Saving...",
            icon: <FiSave size={20} />,
            label: "Publish Event",
            variant: "primary"
          }
        ]}
      />
      {errors.submit && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{errors.submit}</p>}

      <EventTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
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
