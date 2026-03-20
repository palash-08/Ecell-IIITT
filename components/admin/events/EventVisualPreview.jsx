import React from 'react';
import { FiEye, FiUpload, FiInfo } from 'react-icons/fi';

const EventVisualPreview = ({ eventDetails, formFields, onImageChange }) => {
  return (
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
            onChange={onImageChange}
            className="hidden" 
          />
        </div>

        {eventDetails.galleryPreviews && eventDetails.galleryPreviews.length > 0 && (
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
        <div className="max-h-[400px] overflow-y-auto pr-2 no-scrollbar space-y-4">
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
        </div>
        <div className="pt-4 border-t border-gray-100">
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
  );
};

export default EventVisualPreview;
