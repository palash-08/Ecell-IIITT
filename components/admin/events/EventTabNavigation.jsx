import React from 'react';
import { FiSettings, FiLayout, FiInfo, FiUpload } from 'react-icons/fi';

const EventTabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'details', label: 'Basic Details', icon: <FiSettings /> },
    { id: 'form', label: 'Registration Form', icon: <FiLayout /> },
    { id: 'highlights', label: 'Highlights', icon: <FiInfo /> },
    { id: 'media', label: 'Media & Links', icon: <FiUpload /> }
  ];

  return (
    <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap 
            ${activeTab === tab.id 
              ? 'border-[#FFB800] text-black' 
              : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
};

export default EventTabNavigation;
