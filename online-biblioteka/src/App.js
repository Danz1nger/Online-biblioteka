import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './app/header/Header'; // Adjust the path as needed
import Sidebar from './app/components/Sidebar';
import Settings from './app/components/Settings';
import Me from './app/components/Me';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/me" element={<Me />} />
            <Route path="/" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;