// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../components/pages/Home";
import Login from "../components/auth/Login";
import { useAuth } from "../contexts/AuthContext";
import { AuthProvider } from "../contexts/AuthContext";

const App: React.FC = () => {
  const { isSigned } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={isSigned ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
