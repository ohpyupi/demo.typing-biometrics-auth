import React from 'react';
import PropTypes from 'prop-types';

export const Notification = ({
  className, message, onClose,
}) => <div className={`notification ${className}`}>
      <button className="delete" onClick={onClose} ></button>
      {message}
    </div>;

Notification.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
};