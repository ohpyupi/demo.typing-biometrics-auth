import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({
  placeholder, type, className, onClick,
}) => <div className='field'>
    <p className="control">
      <button type={type} className={className || 'button is-success'} onClick={onClick}>{placeholder}</button>
    </p>
  </div>;

Button.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};