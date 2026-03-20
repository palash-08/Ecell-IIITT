import React from 'react';
import { FiUser, FiUpload } from 'react-icons/fi';

const MemberImageUpload = ({ imagePreview, handleImageChange }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center sticky top-8">
      <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Profile Picture</label>
      <div 
        onClick={() => document.getElementById('profile-upload').click()}
        className="w-32 h-32 rounded-full border-2 border-dashed border-gray-200 mx-auto flex items-center justify-center cursor-pointer hover:border-[#FFB800] transition-all overflow-hidden relative group"
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
  );
};

export default MemberImageUpload;
