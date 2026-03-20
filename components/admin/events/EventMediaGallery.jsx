import React from 'react';
import { FiPlus, FiUpload, FiTrash2 } from 'react-icons/fi';

const EventMediaGallery = ({ galleryPreviews, onGalleryChange, onRemoveImage }) => {
  return (
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
          onChange={onGalleryChange}
          className="hidden" 
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryPreviews.map((preview, index) => (
          <div key={index} className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {preview.type === 'video' ? (
              <video 
                src={preview.url} 
                className="w-full h-full object-cover" 
                muted 
                loop 
                onMouseOver={e => e.target.play()} 
                onMouseOut={e => e.target.pause()} 
              />
            ) : (
              <img src={preview.url} alt="Gallery" className="w-full h-full object-cover" />
            )}
            <button 
              onClick={() => onRemoveImage(index)}
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
  );
};

export default EventMediaGallery;
