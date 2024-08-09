import React, { useState } from 'react';
import './Settings.css';
import BookCover from './BookCover';
import BookLetter from './BookLetter';
import BookFormat from './BookFormat';
import BookCategories from './BookCategories'; // Import the BookCategories component

const Settings = () => {
  const [activeTab, setActiveTab] = useState('policy');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cover':
        return <BookCover />;
      case 'letter':
        return <BookLetter />;
      case 'format':
        return <BookFormat />;
      case 'categories':
        return <BookCategories />; // Render the BookCategories component when the 'categories' tab is active
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
        <a href="#policy" className={`inline hover:text-blue-800 ${activeTab === 'policy' ? 'active-book-nav' : ''}`} onClick={() => setActiveTab('policy')}>
          Polisa
        </a>
        <a href="#categories" className={`inline ml-14 hover:text-blue-800 ${activeTab === 'categories' ? 'active-book-nav' : ''}`} onClick={() => setActiveTab('categories')}>
          Kategorije
        </a>
        <a href="#genres" className={`inline ml-14 hover:text-blue-800 ${activeTab === 'genres' ? 'active-book-nav' : ''}`} onClick={() => setActiveTab('genres')}>
          Zanrovi
        </a>
        <a href="#publishers" className={`inline ml-14 hover:text-blue-800 ${activeTab === 'publishers' ? 'active-book-nav' : ''}`} onClick={() => setActiveTab('publishers')}>
          Izdavac
        </a>
        <a href="#cover" className={`inline ml-14 hover:text-blue-800 ${activeTab === 'cover' ? 'active-book-nav' : ''}`} onClick={() => setActiveTab('cover')}>
          Povez
        </a>
        <a href="#format" className={`inline ml-14 hover:text-blue-800 ${activeTab === 'format' ? 'active-book-nav' : ''}`} onClick={() => setActiveTab('format')}>
          Format
        </a>
        <a href="#letter" className={`inline ml-14 hover:text-blue-800 ${activeTab === 'letter' ? 'active-book-nav' : ''}`} onClick={() => setActiveTab('letter')}>
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
