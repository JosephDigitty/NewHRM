import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, type, message, duration };
    setToasts((prev) => [...prev, toast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast('success', message, duration);
  const showError = (message, duration) => addToast('error', message, duration);
  const showLoading = (message) => addToast('loading', message, 0); // No auto-dismiss for loading

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, showSuccess, showError, showLoading }}>
      {children}
    </ToastContext.Provider>
  );
};