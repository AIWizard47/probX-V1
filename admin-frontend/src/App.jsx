import { useState } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthForm from './components/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            // </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<AuthForm/>} />

        {/* 404 page */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
              <h2 className="text-2xl text-gray-600 mt-4">Page Not Found</h2>
              <a
                href="/"
                className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




// const ProtectedRoute = ({ children }) => {
//   const isLoggedIn = localStorage.getItem('token') !== null;

//   if (!isLoggedIn) {
//     // Redirect to login if not authenticated
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };