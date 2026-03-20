import React from 'react';

const MemberProfessionalInfo = ({ memberData, setMemberData }) => {
  if (memberData.category !== 'Alumni') return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6 animate-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Current Company</label>
          <input 
            type="text" 
            value={memberData.company}
            onChange={(e) => setMemberData({...memberData, company: e.target.value})}
            placeholder="e.g. Google" 
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Batch (Year)</label>
          <input 
            type="text" 
            value={memberData.batch}
            onChange={(e) => setMemberData({...memberData, batch: e.target.value})}
            placeholder="e.g. 2022" 
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            maxLength={4}
            minLength={4}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Former Position in E-Cell</label>
        <input 
          type="text" 
          value={memberData.formerPosition}
          onChange={(e) => setMemberData({...memberData, formerPosition: e.target.value})}
          placeholder="e.g. Technical Lead" 
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFB800]/50 outline-none font-medium"
        />
      </div>
    </div>
  );
};

export default MemberProfessionalInfo;
