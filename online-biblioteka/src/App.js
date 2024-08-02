import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './app/header/Header'; // Adjust the path as needed
import Sidebar from './app/sidebar/Sidebar';
import Settings from './app/components/Settings';
import Me from './app/me/Me';
import Login from './app/login/Login'; // Adjust the path as needed
import Register from './app/register/Register';
import Books from './app/CRUDBooks/Books';
import Ucenici from './app/ucenici/Ucenici'; // Import the new component
import NoviUcenik from './app/ucenici/NoviUcenik'; // Import the new component
import './App.css';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('jwt');
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const isAuthRoute = ['/login', '/register'].includes(location.pathname);
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
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/books" element={<Books />} />
              <Route path="/ucenici" element={<Ucenici />} />
              <Route path="/ucenici/noviucenik" element={<NoviUcenik />} /> {/* Add the new route */}
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

export default App;