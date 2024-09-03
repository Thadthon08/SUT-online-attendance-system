import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../components/auth/Login";
import Error from "../components/pages/PageNotFound";
import Dashboard from "../components/pages/Dashboard";
import DLayout from "../components/layout/Menu";
import SubjectDetail from "../components/pages/SubjectDetail";
import CreateRoom from "../components/pages/CreateRoom";
import ScanQRForAttendance from "../components/pages/ScanQRForAttendance";

const PrivateRoute = ({ isSigned }: { isSigned: boolean }) => {
  return isSigned ? (
    <>
      <DLayout />
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
          <Route path="/subject/:subject_id" element={<SubjectDetail />} />
          <Route path="/create-room/:subject_id" element={<CreateRoom />} />
          <Route
            path="/attendence/:subject_id/:room_id"
            element={<ScanQRForAttendance />}
          />
        </Route>
        <Route element={<PublicRoute isSigned={isSigned} />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
