import React from 'react';
import { FiTrash2, FiVideo, FiGrid } from 'react-icons/fi';

export default function GalleryGrid({ items, handleDelete, API_URL }) {
    if (items.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-100 rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center">
                <FiGrid className="mx-auto text-gray-200 mb-6 md:mb-8" size={64} />
                <h3 className="text-xl md:text-2xl font-black text-black mb-2">No Media Found</h3>
                <p className="text-gray-500 font-medium mb-6 md:mb-8 text-sm md:text-base">Start by adding your first photo or video!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
                <div key={item._id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group relative">
                    <div className="aspect-square relative flex items-center justify-center bg-gray-50">
                        {item.mediaType === 'image' ? (
                            <img 
                                src={`${API_URL}${item.url}`} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                        ) : (
                            <div className="w-full h-full relative">
                                <video 
                                    src={`${API_URL}${item.url}`} 
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <FiVideo className="text-white" size={40} />
                                </div>
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 md:p-6">
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className="self-end p-2 md:p-3 bg-red-600/20 text-white rounded-xl hover:bg-red-600 transition-all backdrop-blur-md cursor-pointer"
                            >
                                <FiTrash2 size={18} />
                            </button>
                            <div>
                                <span className="px-3 py-1 bg-[#FFB800] text-black text-[10px] font-black rounded-full uppercase tracking-widest mb-2 inline-block">
                                    {item.category}
                                </span>
                                <h4 className="text-white font-black text-base md:text-lg line-clamp-2">{item.title}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
