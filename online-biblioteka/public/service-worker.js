const CACHE_NAME = 'biblioteka-v1';
const ASSETS_TO_CACHE = [
  // HTML Files
  '/index.html',

  // CSS Files
  '/static/css/main.css',
  '/src/app/bibliotekari/AddBibliotekar.css',
  '/src/app/bibliotekari/BibliotekarDetalji.css',
  '/src/app/bibliotekari/BibliotekarEdit.css',
  '/src/app/bibliotekari/Bibliotekari.css',
  '/src/app/books/Books.css',
  '/src/app/components/EvidencijaIzdanja.css',
  '/src/app/components/EvidencijaRezervacija.css',
  '/src/app/components/Genres.css',
  '/src/app/components/Settings.css',
  '/src/app/header/Header.css',
  '/src/app/login/Login.module.css',
  '/src/app/me/Me.css',
  '/src/app/sidebar/Sidebar.css',
  '/src/index.css',
  '/src/app/components/Footer.css',
  '/src/app/authors/Authors.css',
'/src/app/authors/AuthorDetails.css',
'/src/app/authors/AuthorEdit.css',
'/src/app/authors/NewAuthor.css',
'/src/app/dashboard/Dashboard.css',
'/src/app/publishing/Publishing.css', // Add this line


  // JavaScript Files
  '/static/js/main.js',
  '/src/app/bibliotekari/AddBibliotekar.jsx',
  '/src/app/bibliotekari/BibliotekarDetalji.jsx',
  '/src/app/bibliotekari/BibliotekarEdit.jsx',
  '/src/app/bibliotekari/Bibliotekari.jsx',
  '/src/app/books/BookDetail.jsx',
  '/src/app/books/BookIzdavanje.jsx',
  '/src/app/books/BookReservations.jsx',
  '/src/app/books/Books.jsx',
  '/src/app/books/EditBook.jsx',
  '/src/app/books/NewBook.jsx',
  '/src/app/components/BookCover.jsx',
  '/src/app/components/BookFormat.jsx',
  '/src/app/components/BookLetter.jsx',
  '/src/app/components/EvidencijaIzdanja.jsx',
  '/src/app/components/EvidencijaRezervacija.jsx',
  '/src/app/components/Genres.jsx',
  '/src/app/components/ImageFallback.jsx',
  '/src/app/components/ScrollToTop.jsx',
  '/src/app/components/Settings.jsx',
  '/src/app/components/Spinner.jsx',
  '/src/app/header/Header.jsx',
  '/src/app/login/ForgotPassword.jsx',
  '/src/app/login/Login.jsx',
  '/src/app/me/Me.jsx',
  '/src/app/register/Register.jsx',
  '/src/app/sidebar/Sidebar.jsx',
  '/src/app/ucenici/Ucenici.jsx',
  '/src/App.js',
  '/src/index.js',
  '/src/reportWebVitals.js',
  '/src/setupTests.js',
  '/src/app/components/Footer.jsx',
  '/src/app/authors/Authors.jsx',
'/src/app/authors/AuthorDetails.jsx',
'/src/app/authors/AuthorEdit.jsx',
'/src/app/authors/NewAuthor.jsx',
'/src/app/components/ConnectionStatus.jsx',
'/src/app/dashboard/Dashboard.jsx',
'/src/app/publishing/Publishing.jsx', // Add this line
  
  // Images
  '/public/ava.png',
  '/public/background.jpg',
  '/public/book.png',
  '/public/favicon.ico',
  '/public/logo192.png',
  '/public/logo512.png',
  '/public/logo.svg',

  // Manifest and other files
  '/public/manifest.json',
  '/public/robots.txt',

  // External Resources
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
