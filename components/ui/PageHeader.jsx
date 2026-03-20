import React from 'react';

const PageHeader = ({ title, highlight, description, children }) => {
  return (
    <div className="bg-black py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB800] rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">
          {title} <span className="text-[#FFB800]">{highlight}</span>
        </h1>
        {description && (
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
