import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({
  placeholder, type, className,
}) => <div className={`field ${className}`}>
    <p className="control">
      <button type={type} className="button is-success">{placeholder}</button>
    </p>
  </div>;

Button.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
};