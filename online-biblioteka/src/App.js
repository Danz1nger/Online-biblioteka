import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './app/header/Header';
import Sidebar from './app/sidebar/Sidebar';
import Settings from './app/components/Settings';
import Me from './app/me/Me';
import Login from './app/login/Login';
import Register from './app/register/Register';
import ForgotPassword from './app/login/ForgotPassword';
import Books from './app/CRUDBooks/Books';
import Ucenici from './app/ucenici/Ucenici';
import NoviUcenik from './app/ucenici/NoviUcenik';
import Ucenik from './app/ucenici/Ucenik';
import EvidencijaIzdavanja from './app/components/EvidencijaIzdavanja';
import EvidencijaRezervacija from './app/components/EvidencijaRezervacija';
import './App.css';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('jwt');
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const isAuthRoute = ['/login', '/register', '/forgotpassword'].includes(location.pathname);
  const showHeader = isAuthenticated || !isAuthRoute;

  return (
    <div className={`App ${showHeader ? '' : 'no-header'}`}>
      {showHeader && <Header />}
      {isAuthenticated ? (
        <div className={`main-container-app ${isSidebarExpanded ? 'expanded' : ''}`}>
          <Sidebar onToggle={handleSidebarToggle} />
          <div className="content">
            <Routes>
              <Route path="/me" element={<Me />} />
              <Route path="/" element={<Settings />} />
              <Route path="/books" element={<Books />} />
              <Route path="/ucenici" element={<Ucenici />} />
              <Route path="/ucenici/noviucenik" element={<NoviUcenik />} />
              <Route path="/ucenici/ucenik/:id" element={<Ucenik />} />
              <Route path="/ucenici/ucenik/:id/edit" element={<Ucenik />} />
              <Route path="/me/izdavanje" element={<EvidencijaIzdavanja />} />
              <Route path="/me/rezervacija" element={<EvidencijaRezervacija />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

export default App;