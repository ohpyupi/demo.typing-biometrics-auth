import React from 'react';
import PropTypes from 'prop-types';

export const Input = ({
  label, placeholder, type, value, onChange, attrs, className, disabled, readOnly,
}) => <div className={`field ${className}`}>
      <label className="label">{label}</label>
      <div className="control">
        <input className="input" type={type} placeholder={placeholder} value={value || ''} onChange={onChange} {...attrs} disabled={disabled} readOnly={readOnly} />
      </div>
    </div>;

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  attrs: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};