import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

const AdminHeader = ({ backLink, title, highlight, description, actions = [] }) => {
  return (
    <div className="mb-8">
      {backLink && (
        <Link href={backLink} className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors mb-4 no-underline">
          <FiArrowLeft />
          Back
        </Link>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black mb-2">
            {title} {highlight && <span className="text-[#FFB800]">{highlight}</span>}
          </h1>
          {description && <p className="text-gray-500 font-medium text-base md:text-lg">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {action.href ? (
                <Link 
                  href={action.href}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm no-underline ${
                    action.variant === 'primary' 
                      ? 'bg-[#FFB800] text-black hover:bg-[#e6a700] hover:-translate-y-0.5' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {action.icon && <span>{action.icon}</span>}
                  {action.label}
                </Link>
              ) : (
                <button
                  onClick={action.onClick}
                  disabled={action.disabled}
                  title={action.title}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 ${
                    action.variant === 'primary' 
                      ? 'bg-[#FFB800] text-black hover:bg-[#e6a700] hover:-translate-y-0.5' 
                      : action.variant === 'secondary'
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {action.loading ? (
                    <div className={`w-5 h-5 border-2 rounded-full animate-spin ${action.variant === 'primary' ? 'border-black' : 'border-current'} border-t-transparent`}></div>
                  ) : (
                    action.icon && <span>{action.icon}</span>
                  )}
                  {action.loading ? (action.loadingLabel || 'Saving...') : action.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
