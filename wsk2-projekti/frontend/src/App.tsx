// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LogInPage';
import RegisterPage from './pages/RegisterPage';
import TripPage from './pages/TripPage';
import MyTripsPage from './pages/MyTripsPage';
import CreateTripPage from './pages/CreateTripPage';
import EditTripPage from './pages/EditTripPage';
import AddFlightPage from './pages/AddFlightPage';
import AddAccommodationPage from './pages/AddAccommodationPage';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mytrips" element={<MyTripsPage />} />
      <Route path="/trip/*" element={<TripPage />} />
      <Route path="/create-trip" element={<CreateTripPage />} />
      <Route path="/edit-trip/*" element={<EditTripPage />} />
      <Route path="/add-flight/*" element={<AddFlightPage />} />
      <Route path="/add-accommodation/*" element={<AddAccommodationPage />} />
      {/* ... other routes */}
    </Routes>
  </BrowserRouter>
);

export default App;

