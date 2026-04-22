import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea 
        className={`form-textarea ${error ? 'form-input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
};

export default FormTextarea;
