import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './app/header/Header'; // Adjust the path as needed
import Sidebar from './app/components/Sidebar';
import Settings from './app/components/Settings';
import Me from './app/components/Me';
import Login from './Login'; // Adjust the path as needed
import './App.css';
import Register from './app/components/Register';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('jwt');

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <Header />
          <div className="main-container">
            <Sidebar />
            <div className="content">
              <Routes>
                <Route path="/me" element={<Me />} />
                <Route path="/" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </div>
  );
};

export default App;