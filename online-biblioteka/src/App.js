// src/App.js

import React, { Suspense, lazy, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './app/header/Header';
import Sidebar from './app/sidebar/Sidebar';
import Spinner from '../src/app/components/Spinner';
import ImageFallback from '../src/app/components/ImageFallback';
import ScrollToTop from './app/components/ScrollToTop';
import './App.css';

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
const BookIzdavanje = lazy(() => import('./app/books/BookIzdavanje')); // Import the new BookIzdavanje component
const Ucenici = lazy(() => import('./app/ucenici/Ucenici'));
const NoviUcenik = lazy(() => import('./app/ucenici/NoviUcenik'));
const Ucenik = lazy(() => import('./app/ucenici/Ucenik'));
const EvidencijaIzdavanja = lazy(() => import('./app/components/EvidencijaIzdavanja'));
const EvidencijaRezervacija = lazy(() => import('./app/components/EvidencijaRezervacija'));
const Bibliotekari = lazy(() => import('./app/bibliotekari/Bibliotekari'));
const AddBibliotekar = lazy(() => import('./app/bibliotekari/AddBibliotekar'));
const BibliotekarDetalji = lazy(() => import('./app/bibliotekari/BibliotekarDetalji'));
const BibliotekarEdit = lazy(() => import('./app/bibliotekari/BibliotekarEdit'));

const App = () => {
  const isAuthenticated = !!localStorage.getItem('jwt');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const isAuthRoute = ['/login', '/register', '/forgotpassword'].includes(location.pathname);
  const showHeader = isAuthenticated || !isAuthRoute;

  return (
    <div className={`App ${showHeader ? '' : 'no-header'}`}>
      <ScrollToTop />
      {showHeader && <Header />}
      {isAuthenticated ? (
        <div className={`main-container-app ${isSidebarExpanded ? 'expanded' : ''}`}>
          <Sidebar onToggle={handleSidebarToggle} isExpanded={isSidebarExpanded} />
          <div className="content">
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/me" element={<Me />} />
                <Route path="/" element={<Settings />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/book/:id" element={<BookDetail />} />
                <Route path="/books/book/:id/edit" element={<EditBook />} />
                <Route path="/books/newbook" element={<NewBook />} />
                <Route path="/books/book/reservations/:id" element={<BookReservations />} />
                <Route path="/books/book/izdavanja/:id" element={<BookIzdavanje />} /> {/* New route */}
                <Route path="/ucenici" element={<Ucenici />} />
                <Route path="/ucenici/noviucenik" element={<NoviUcenik />} />
                <Route path="/ucenici/ucenik/:id" element={<Ucenik />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/me/izdavanje" element={<EvidencijaIzdavanja />} />
                <Route path="/me/rezervacija" element={<EvidencijaRezervacija />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/bibliotekari" element={<Bibliotekari />} />
                <Route path="/bibliotekari/add" element={<AddBibliotekar />} />
                <Route
                  path="/bibliotekari/bibliotekar/:id"
                  element={<BibliotekarDetalji />}
                />
                <Route
                  path="/bibliotekari/bibliotekar/:id/edit"
                  element={<BibliotekarEdit />}
                />
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

export default React.memo(App);