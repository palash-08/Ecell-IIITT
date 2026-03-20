import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInbox } from 'react-icons/fi';

const AdminStatusBlock = ({ type = 'loading', message, subMessage, onRetry, children }) => {
  if (type === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">
          {message || 'Loading Data...'}
        </p>
      </div>
    );
  }

  if (type === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-black mb-2">{message || 'Completed!'}</h2>
        <p className="text-gray-500 font-medium">{subMessage}</p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl flex flex-col items-center gap-4 text-center">
        <FiAlertCircle size={40} className="text-red-400" />
        <div>
            <p className="font-bold text-lg mb-1">{message || 'Something went wrong'}</p>
            {subMessage && <p className="text-sm text-red-600 opacity-80">{subMessage}</p>}
        </div>
        {onRetry && (
            <button 
                onClick={onRetry} 
                className="mt-2 text-sm font-bold bg-white px-6 py-2 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
            >
                Try Again
            </button>
        )}
      </div>
    );
  }

  if (type === 'empty') {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            {children || <FiInbox size={32} />}
        </div>
        <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">{message || 'Nothing found'}</h3>
        <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">{subMessage}</p>
        {onRetry && (
            <button 
                onClick={onRetry} 
                className="text-[#FFB800] font-black uppercase tracking-widest text-xs hover:underline"
            >
                {onRetry.label || 'Refresh'}
            </button>
        )}
      </div>
    );
  }

  return children;
};

export default AdminStatusBlock;
