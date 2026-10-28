import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Production from "./pages/Production";
import Equipment from "./pages/Equipment";
import Blasting from "./pages/Blasting";
import Safety from "./pages/Safety";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
          <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
          <Route path="/blasting" element={<ProtectedRoute><Blasting /></ProtectedRoute>} />
          <Route path="/safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;