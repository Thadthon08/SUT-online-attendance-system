import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Home from "../components/pages/Home";
import Login from "../components/auth/Login";
import Error from "../components/pages/Error";
import Dashboard from "../components/pages/Dashboard";

export default function AppRoutes() {
  const { isSigned } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isSigned ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isSigned ? <Login /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
