import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ id, type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, type, onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'loading':
        return '⟳';
      default:
        return '';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        {type !== 'loading' && (
          <button className="toast-close" onClick={() => onClose(id)}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;