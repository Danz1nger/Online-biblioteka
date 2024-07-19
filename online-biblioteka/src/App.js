
import React from 'react';
import Header from './app/header/Header'
import Sidebar from './app/components/Sidebar'
import Settings from './app/components/Settings';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className="content">
        <Settings />
        </div>
      </div>
    </div>
  );
}

export default App;
