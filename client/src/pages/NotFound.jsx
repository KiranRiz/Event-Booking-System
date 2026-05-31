import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-900 text-white flex items-center justify-center py-20 px-4">
      <div className="theme-card max-w-lg w-full text-center p-10">
        <h1 className="text-6xl font-black mb-4">404</h1>
        <p className="text-lg text-theme-text-muted mb-6">
          The page you are looking for cannot be found.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-black font-semibold rounded-full hover:bg-orange-600 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
