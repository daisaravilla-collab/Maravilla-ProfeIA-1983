import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label className="mb-1 text-sm font-semibold text-gray-700">{label}</label>
      <select
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      >
        <option value="" disabled>Selecciona una opción</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};
