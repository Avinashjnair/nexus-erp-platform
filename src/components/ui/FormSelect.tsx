import React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select 
        className={`form-select ${error ? 'form-input-error' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
};

export default FormSelect;
