import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './app/header/Header'; // Adjust the path as needed
import Sidebar from './app/sidebar/Sidebar';
import Settings from './app/components/Settings';
import Me from './app/me/Me';
import Login from './app/login/Login'; // Adjust the path as needed
import './App.css';
import Register from './app/register/Register';
import Books from './app/CRUDBooks/Books';

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
                <Route path="/books" element={<Books/>} />
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