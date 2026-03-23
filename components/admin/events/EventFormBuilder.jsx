import React from 'react';
import { FiPlus, FiTrash2, FiSettings } from 'react-icons/fi';

const EventFormBuilder = ({ formFields, setFormFields }) => {
  const addField = (type) => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      systematic: false,
      options: ['radio', 'checkbox'].includes(type) ? ['Option 1'] : undefined
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(f => f.id !== id && !f.systematic));
  };

  const updateField = (id, updates) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const fieldTypes = [
    { type: 'text', label: 'Short Text' },
    { type: 'textarea', label: 'Long Text' },
    { type: 'number', label: 'Number' },
    { type: 'radio', label: 'Single Choice' },
    { type: 'checkbox', label: 'Multiple Choice' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center overflow-x-auto no-scrollbar">
        <p className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-tighter shrink-0">Add Field:</p>
        <div className="flex gap-2">
          {fieldTypes.map((ft) => (
            <button 
              key={ft.type}
              onClick={() => addField(ft.type)} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB800] hover:text-black text-gray-600 rounded-lg font-bold text-xs transition-colors shrink-0 border border-gray-100"
            >
              <FiPlus /> {ft.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {formFields.map((field) => (
          <div key={field.id} className={`group bg-white border ${field.systematic ? 'border-amber-100 bg-amber-50/20' : 'border-gray-200'} rounded-2xl p-6 shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase">
                   {field.type === 'radio' ? 'Single Choice' : field.type === 'checkbox' ? 'Multiple Choice' : field.type}
                 </span>
                 {field.systematic && <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase"><FiSettings size={10} /> System Field</span>}
              </div>
              {!field.systematic && (
                <button onClick={() => removeField(field.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Field Label</label>
                <input 
                  type="text" 
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-[#FFB800] focus:outline-none font-bold text-black" 
                />
              </div>

              {(field.type === 'radio' || field.type === 'checkbox') && (
                <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Options</label>
                    <button 
                      onClick={() => {
                        const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                        updateField(field.id, { options: newOptions });
                      }}
                      className="text-[10px] font-bold text-[#FFB800] hover:underline"
                    >
                      + Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {field.options?.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-3 h-3 border border-gray-300 ${field.type === 'radio' ? 'rounded-full' : 'rounded-sm'}`}></div>
                        <input 
                          type="text" 
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...field.options];
                            newOptions[idx] = e.target.value;
                            updateField(field.id, { options: newOptions });
                          }}
                          className="flex-1 bg-transparent text-sm font-medium focus:outline-none border-b border-transparent focus:border-gray-200"
                        />
                        {field.options.length > 1 && (
                          <button 
                            onClick={() => {
                              const newOptions = field.options.filter((_, i) => i !== idx);
                              updateField(field.id, { options: newOptions });
                            }}
                            className="text-gray-300 hover:text-red-500"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}



              <div className="flex items-center gap-4 pt-4 md:pt-0">
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                       type="checkbox" 
                       checked={field.required}
                       onChange={(e) => updateField(field.id, { required: e.target.checked })}
                       className="w-4 h-4 accent-[#FFB800]" 
                    />
                    <span className="text-sm font-bold text-gray-700">Required Field</span>
                 </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventFormBuilder;
