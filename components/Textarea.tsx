import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label className="mb-1 text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow resize-y min-h-[100px] ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};
