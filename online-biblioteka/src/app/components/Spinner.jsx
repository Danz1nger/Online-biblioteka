import React from 'react';

const Spinner = () => {
  const spinnerContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const spinnerStyle = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '50%',
    borderTop: '4px solid #007bff',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  };

  const outerContainerStyle = {
    height: '1000px',
    width: '100%',
    position: 'relative',  // This ensures the spinner is positioned relative to this container
  };

  const keyframesStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={outerContainerStyle}>
      <style>{keyframesStyle}</style>
      <div style={spinnerContainerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </div>
  );
};

export default React.memo(Spinner);
