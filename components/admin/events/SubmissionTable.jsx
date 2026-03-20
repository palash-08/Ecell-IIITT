import React from 'react';

const SubmissionTable = ({ registrations }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Participant</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Registration Date</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {registrations.map((reg) => (
              <tr key={reg._id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center text-[#FFB800] font-bold">
                        {reg.formData['Full Name']?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-black text-base">{reg.formData['Full Name'] || 'Unknown'}</p>
                      <p className="text-sm font-medium text-gray-500">{reg.formData['Email Address'] || 'No Email'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-600 font-medium text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold">{new Date(reg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(reg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(reg.formData).map(([key, value]) => {
                      if (key === 'Full Name' || key === 'Email Address') return null;
                      return (
                        <div key={key} className="text-[10px] bg-gray-100 px-2 py-1 rounded border border-gray-200 max-w-[200px] truncate">
                          <span className="font-bold text-gray-400 uppercase mr-1">{key}:</span>
                          <span className="text-gray-700">{String(value)}</span>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionTable;
