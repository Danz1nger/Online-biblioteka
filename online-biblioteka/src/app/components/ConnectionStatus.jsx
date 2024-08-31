import React, { useState, useEffect } from 'react';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: isOnline ? '#4CAF50' : '#F44336',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      {isOnline ? (
        <>
          <WifiIcon style={{ marginRight: '10px' }} />
          Internet connection restored
        </>
      ) : (
        <>
          <WifiOffIcon style={{ marginRight: '10px' }} />
          No internet connection
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;
