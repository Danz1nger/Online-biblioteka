// ImageFallback.jsx
import React from 'react';

const ImageFallback = () => (
  <div style={{ 
    width: '100vw', 
    height: '100vh', 
    backgroundImage: 'url(/public/background.jpg)', 
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    {/* Optionally, you can add some text or a logo here */}
  </div>
);

export default ImageFallback;
