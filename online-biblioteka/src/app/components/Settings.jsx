import React, { useState } from 'react';
import './Settings.css';
import Cover from './Cover';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('policy');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cover':
        return <Cover />;
      // Add cases for other tabs as needed
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="settings">
      <div className="heading mt-7">
        <div className="border-b border-gray-200">
          <div className="pl-8 pb-5">
            <h1>Settings</h1>
          </div>
        </div>
      </div>
      <div className="py-4 text-gray-500 border-b border-gray-200 pl-8">
        <a href="#policy" className="inline hover:text-blue-800 active-book-nav" onClick={() => setActiveTab('policy')}>
          Polisa
        </a>
        <a href="#categories" className="inline ml-14 hover:text-blue-800" onClick={() => setActiveTab('categories')}>
          Kategorije
        </a>
        <a href="#genres" className="inline ml-14 hover:text-blue-800" onClick={() => setActiveTab('genres')}>
          Zanrovi
        </a>
        <a href="#publishers" className="inline ml-14 hover:text-blue-800" onClick={() => setActiveTab('publishers')}>
          Izdavac
        </a>
        <a href="#cover" className="inline ml-14 hover:text-blue-800" onClick={() => setActiveTab('cover')}>
          Povez
        </a>
        <a href="#format" className="inline ml-14 hover:text-blue-800" onClick={() => setActiveTab('format')}>
          Format
        </a>
        <a href="#letter" className="inline ml-14 hover:text-blue-800" onClick={() => setActiveTab('letter')}>
          Pismo
        </a>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;
