import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../components/auth/Login";
import Error from "../components/pages/Error";
import Dashboard from "../components/pages/Dashboard";
import DLayout from "../components/layout/Menu";
import Home from "../components/pages/Home";

const PrivateRoute = ({ isSigned }: { isSigned: boolean }) => {
  return isSigned ? (
    <>
      <DLayout />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const PublicRoute = ({ isSigned }: { isSigned: boolean }) => {
  return !isSigned ? <Outlet /> : <Navigate to="/" />;
};

export default function AppRoutes() {
  const { isSigned } = useAuth();

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute isSigned={isSigned} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subject" element={<Home />} />
        </Route>
        <Route element={<PublicRoute isSigned={isSigned} />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
