import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './app/header/Header';
import Sidebar from './app/sidebar/Sidebar';
import Spinner from '../src/app/components/Spinner'; // For authenticated fallback
import ImageFallback from '../src/app//components/ImageFallback'; // Import the ImageFallback component
import './App.css';
import Authors from './app/Authors/Authors';
import NewAuthor from './app/Authors/NewAuthor';
import AuthorDetails from './app/Authors/AuthorDetails';
import AuthorEdit from './app/Authors/AuthorEdit'

// Lazy loading components
const Settings = lazy(() => import('./app/components/Settings'));
const Me = lazy(() => import('./app/me/Me'));
const Login = lazy(() => import('./app/login/Login'));
const Register = lazy(() => import('./app/register/Register'));
const ForgotPassword = lazy(() => import('./app/login/ForgotPassword'));
const Books = lazy(() => import('./app/CRUDBooks/Books'));
const Ucenici = lazy(() => import('./app/ucenici/Ucenici'));
const NoviUcenik = lazy(() => import('./app/ucenici/NoviUcenik'));
const Ucenik = lazy(() => import('./app/ucenici/Ucenik'));
const EvidencijaIzdavanja = lazy(() => import('./app/components/EvidencijaIzdavanja'));
const EvidencijaRezervacija = lazy(() => import('./app/components/EvidencijaRezervacija'));

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
            <Suspense fallback={<Spinner />}>
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
                <Route path="/authors" element={<Authors />} />
                <Route path= "/authors/add" element={<NewAuthor/>}/>
                <Route path="/authors/author/:id" element={<AuthorDetails />} />
                <Route path="/authors/author/:id/edit" element={<AuthorEdit />} />


              </Routes>
            </Suspense>
          </div>
        </div>
      ) : (
        <Suspense fallback={<ImageFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      )}
    </div>
  );
};

export default App;
