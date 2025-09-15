import React from 'react';

function ErrorMessage({ message, onDismiss, type = 'error' }) {
  if (!message) return null;

  const getErrorClass = () => {
    switch (type) {
      case 'warning':
        return 'error-message warning';
      case 'info':
        return 'error-message info';
      case 'success':
        return 'error-message success';
      default:
        return 'error-message';
    }
  };

  return (
    <div className={getErrorClass()}>
      <div className="error-content">
        <span className="error-text">{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="error-dismiss"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
