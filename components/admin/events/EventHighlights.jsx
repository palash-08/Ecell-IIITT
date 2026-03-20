import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const EventHighlights = ({ highlights, setHighlights }) => {
  const addHighlight = () => {
    setHighlights([...highlights, { label: '', value: '' }]);
  };

  const removeHighlight = (index) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setHighlights(newHighlights);
  };

  const updateHighlight = (index, updates) => {
    const newHighlights = [...highlights];
    newHighlights[index] = { ...newHighlights[index], ...updates };
    setHighlights(newHighlights);
  };

  return (
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
        {highlights.map((highlight, index) => (
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

      {highlights.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400 font-medium">No highlights added yet.</p>
          <button onClick={addHighlight} className="text-[#FFB800] font-bold hover:underline mt-2">+ Add your first highlight</button>
        </div>
      )}
    </div>
  );
};

export default EventHighlights;
