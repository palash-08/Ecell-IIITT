import React from 'react';
import { FiCalendar, FiMapPin, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

const EventListTable = ({ events, onDelete }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Event Details</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date & Venue</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                      {event.mainImage ? (
                        <img src={`${API_URL}${event.mainImage}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiCalendar size={18} />
                        </div>
                      )}
                    </div>
                        <div>
                          <Link href={`/admin/events/${event._id}`} className="font-bold text-black text-base hover:text-[#FFB800] transition-colors no-underline">
                            {event.title}
                          </Link>
                          <p className="text-sm font-medium text-gray-500 mt-0.5">{event.category}</p>
                        </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                       <FiCalendar size={14} className="text-[#FFB800]" />
                       {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                       <FiMapPin size={14} className="text-gray-400" />
                       {event.venue}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {(() => {
                    const eventDate = new Date(event.date);
                    eventDate.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isCompleted = event.status === 'Completed' || eventDate < today;
                    const displayStatus = isCompleted ? 'Completed' : 'Upcoming';
                    
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        !isCompleted ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${!isCompleted ? 'bg-amber-400' : 'bg-green-500'}`}></span>
                        {displayStatus}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/admin/events/${event._id}/submissions`}
                      className="p-2 text-gray-400 hover:text-[#FFB800] hover:bg-amber-50 rounded-lg transition-colors" 
                      title="View Submissions"
                    >
                      <FiUser size={18} />
                    </Link>
                    <Link 
                      href={`/admin/events/${event._id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button 
                      onClick={() => onDelete(event._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
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

export default EventListTable;
