import React from 'react';

const MemberBasicInfo = ({ memberData, setMemberData, categories }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name *</label>
        <input 
          type="text" 
          value={memberData.name}
          onChange={(e) => setMemberData({...memberData, name: e.target.value})}
          placeholder="e.g. Ananya Sharma" 
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Role *</label>
          <input 
            type="text" 
            value={memberData.role}
            onChange={(e) => setMemberData({...memberData, role: e.target.value})}
            placeholder="e.g. President" 
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category *</label>
          <select 
            value={memberData.category}
            onChange={(e) => setMemberData({...memberData, category: e.target.value})}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">LinkedIn URL</label>
          <input 
            type="url" 
            value={memberData.linkedin}
            onChange={(e) => setMemberData({...memberData, linkedin: e.target.value})}
            placeholder="https://linkedin.com/..." 
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address *</label>
          <input 
            type="email" 
            value={memberData.email}
            onChange={(e) => setMemberData({...memberData, email: e.target.value})}
            placeholder="name@example.com" 
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default MemberBasicInfo;
