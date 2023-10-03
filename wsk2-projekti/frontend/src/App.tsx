// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LogInPage';
import RegisterPage from './pages/RegisterPage';
import TripPage from './pages/TripPage';
import MyTripsPage from './pages/MyTripsPage';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mytrips" element={<MyTripsPage />} />
      <Route path="/trip/*" element={<TripPage />} />
      {/* ... other routes */}
    </Routes>
  </BrowserRouter>
);

export default App;

