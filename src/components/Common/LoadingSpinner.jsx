import React from 'react';

function LoadingSpinner({
  size = 'medium',
  message = 'Loading...',
  showMessage = true,
  className = ''
}) {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'spinner-small';
      case 'large':
        return 'spinner-large';
      default:
        return 'spinner-medium';
    }
  };

  return (
    <div className={`loading-container ${className}`}>
      <div className={`loading-spinner ${getSizeClass()}`}>
        <div className="spinner-circle"></div>
      </div>
      {showMessage && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;
