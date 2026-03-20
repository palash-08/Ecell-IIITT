import React from 'react';

const EventBasicDetails = ({ eventDetails, setEventDetails }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Event Title</label>
            <span className="text-[10px] font-bold text-gray-400">{(eventDetails.title || '').length}/200</span>
          </div>
          <input 
            type="text" 
            name="title"
            value={eventDetails.title || ''}
            onChange={handleChange}
            placeholder="e.g. Global Entrepreneurship Summit" 
            maxLength={200}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black"
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Date</label>
          <input 
            type="date" 
            name="date"
            value={eventDetails.date || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black text-sm uppercase"
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Start Time</label>
            <input 
              type="time" 
              name="startTime"
              value={eventDetails.startTime || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">End Time</label>
            <input 
              type="time" 
              name="endTime"
              value={eventDetails.endTime || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category</label>
          <select 
            name="category"
            value={eventDetails.category || 'Flagship'}
            onChange={handleChange}
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
            <span className="text-[10px] font-bold text-gray-400">{(eventDetails.venue || '').length}/200</span>
          </div>
          <input 
            type="text" 
            name="venue"
            value={eventDetails.venue || ''}
            onChange={handleChange}
            placeholder="e.g. Auditorium / G-Meet Link" 
            maxLength={200}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black"
            required 
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
            <span className="text-[10px] font-bold text-gray-400">{(eventDetails.description || '').length}/1000</span>
          </div>
          <textarea 
            rows={6} 
            name="description"
            value={eventDetails.description || ''}
            onChange={handleChange}
            placeholder="Describe the event, prizes, and schedule..." 
            maxLength={1000}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium text-black resize-none"
            required 
          />
        </div>
      </div>
    </div>
  );
};

export default EventBasicDetails;
