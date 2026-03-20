import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const EventExternalLinks = ({ externalLinks, setExternalLinks }) => {
  const addExternalLink = () => {
    setExternalLinks([...externalLinks, { label: '', url: '' }]);
  };

  const removeExternalLink = (index) => {
    const newLinks = [...externalLinks];
    newLinks.splice(index, 1);
    setExternalLinks(newLinks);
  };

  const updateExternalLink = (index, updates) => {
    const newLinks = [...externalLinks];
    newLinks[index] = { ...newLinks[index], ...updates };
    setExternalLinks(newLinks);
  };

  return (
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
        {externalLinks.map((link, index) => (
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
        
        {externalLinks.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
             <p className="text-gray-400 text-sm">No external links added.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventExternalLinks;
