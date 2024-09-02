import React, { Suspense, lazy, useState, useCallback, useMemo, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './app/header/Header';
import Sidebar from './app/sidebar/Sidebar';
import Footer from './app/components/Footer';
import Spinner from '../src/app/components/Spinner';
import ImageFallback from '../src/app/components/ImageFallback';
import ScrollToTop from './app/components/ScrollToTop';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConnectionStatus from './app/components/ConnectionStatus';
import Dashboard from './app/dashboard/Dashboard';

// Lazy loading components
const Settings = lazy(() => import('./app/components/Settings'));
const Me = lazy(() => import('./app/me/Me'));
const Login = lazy(() => import('./app/login/Login'));
const ForgotPassword = lazy(() => import('./app/login/ForgotPassword'));
const Register = lazy(() => import('./app/register/Register'));
const Books = lazy(() => import('./app/books/Books'));
const BookDetail = lazy(() => import('./app/books/BookDetail'));
const EditBook = lazy(() => import('./app/books/EditBook'));
const NewBook = lazy(() => import('./app/books/NewBook'));
const BookReservations = lazy(() => import('./app/books/BookReservations'));
const BookIzdavanje = lazy(() => import('./app/books/BookIzdavanje'));
const Publishing = lazy(() => import('./app/publishing/Publishing')); // Add this line
const Ucenici = lazy(() => import('./app/ucenici/Ucenici'));
const NoviUcenik = lazy(() => import('./app/ucenici/NoviUcenik'));
const Ucenik = lazy(() => import('./app/ucenici/Ucenik'));
const EvidencijaIzdavanja = lazy(() => import('./app/components/EvidencijaIzdavanja'));
const EvidencijaRezervacija = lazy(() => import('./app/components/EvidencijaRezervacija'));
const Bibliotekari = lazy(() => import('./app/bibliotekari/Bibliotekari'));
const AddBibliotekar = lazy(() => import('./app/bibliotekari/AddBibliotekar'));
const BibliotekarDetalji = lazy(() => import('./app/bibliotekari/BibliotekarDetalji'));
const BibliotekarEdit = lazy(() => import('./app/bibliotekari/BibliotekarEdit'));
const Authors = lazy(() => import('./app/authors/Authors'));
const AuthorDetails = lazy(() => import('./app/authors/AuthorDetails'));
const AuthorEdit = lazy(() => import('./app/authors/AuthorEdit'));
const NewAuthor = lazy(() => import('./app/authors/NewAuthor'));


// 1. Memoize child components
const MemoizedHeader = React.memo(Header);
const MemoizedSidebar = React.memo(Sidebar);
const MemoizedFooter = React.memo(Footer);

const App = () => {
  const isAuthenticated = !!localStorage.getItem('jwt');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState(null);

  // 2. Memoize callback functions
  const handleSidebarToggle = useCallback(() => {
    setIsSidebarExpanded((prev) => !prev);
  }, []);

  const handleHeaderVisibilityChange = useCallback((hidden) => {
    setIsHeaderHidden(hidden);
  }, []);

  // 3. Memoize derived values
  const isAuthRoute = useMemo(() => {
    return ['/login', '/register', '/forgotpassword'].includes(location.pathname);
  }, [location.pathname]);

  const showHeader = useMemo(() => {
    return isAuthenticated && !isAuthRoute;
  }, [isAuthenticated, isAuthRoute]);

  useEffect(() => {
    if (globalError) {
      toast.error(globalError);
      setGlobalError(null);
    }
  }, [globalError]);

  useEffect(() => {
    // Add a response interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 403) {
            // Handle 403 Forbidden specifically
            setGlobalError(error.response.data.error || "Not authorized.");
          } else {
            setGlobalError(error.response.data.message || 'An error occurred');
          }
          if (error.response.status === 401) {
            // Unauthorized, redirect to login
            localStorage.removeItem('jwt'); // Clear the invalid token
            navigate('/login');
          }
        } else if (error.request) {
          // The request was made but no response was received
          setGlobalError('No response received from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          setGlobalError('Error setting up the request');
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  useEffect(() => {
    // Move the dark mode logic here
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className={`App ${isHeaderHidden || !showHeader ? 'no-header' : ''}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      {showHeader && (
        <MemoizedHeader onHeaderVisibilityChange={handleHeaderVisibilityChange} />
      )}
      {isAuthenticated ? (
        <div className={`main-container-app ${isSidebarExpanded ? 'expanded' : ''}`}>
          <MemoizedSidebar
            onToggle={handleSidebarToggle}
            isExpanded={isSidebarExpanded}
            isHeaderHidden={isHeaderHidden}
          />
          <div className="content">
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/me" element={<Me />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/book/:id" element={<BookDetail />} />
                <Route path="/books/book/:id/edit" element={<EditBook />} />
                <Route path="/books/newbook" element={<NewBook />} />
                <Route path="/books/book/reservations/:id" element={<BookReservations />} />
                <Route path="/books/book/izdavanja/:id" element={<BookIzdavanje />} />
                <Route path="/ucenici" element={<Ucenici />} />
                <Route path="/ucenici/noviucenik" element={<NoviUcenik />} />
                <Route path="/ucenici/ucenik/:id" element={<Ucenik />} />
                <Route path="/me/izdavanje" element={<EvidencijaIzdavanja />} />
                <Route path="/me/rezervacija" element={<EvidencijaRezervacija />} />
                <Route path="/bibliotekari" element={<Bibliotekari />} />
                <Route path="/bibliotekari/add" element={<AddBibliotekar />} />
                <Route path="/bibliotekari/bibliotekar/:id" element={<BibliotekarDetalji />} />
                <Route path="/bibliotekari/bibliotekar/:id/edit" element={<BibliotekarEdit />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/authors/author/:id" element={<AuthorDetails />} />
                <Route path="/authors/author/:id/edit" element={<AuthorEdit />} />
                <Route path="/authors/add" element={<NewAuthor />} />
                <Route path="/publishing" element={<Publishing />} /> {/* Add this line */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
            <MemoizedFooter />
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
      <ConnectionStatus />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        style={{ top: showHeader ? '60px' : '0' }}
      />
    </div>
  );
};

// 4. Memoize the entire App component
export default React.memo(App);