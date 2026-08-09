import React from 'react';
import { useToastContext } from '../../Context/ToastContext';
import Toast from './Toast';
import './Toast.css';

const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default ToastContainer;