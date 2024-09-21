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
import StudentLogin from "../components/auth/student/StudentLogin";
import AttendanceRoom from "../components/pages/StudentPage/AttendanceRoom";
import RoomAttHistory from "../components/pages/RoomHistory";
import RoomList from "../components/pages/RoomList";
import AttendanceSuccess from "../components/pages/StudentPage/AttendanceSuccess";

const isStudentLoggedIn = () => {
  const accessToken = localStorage.getItem(
    "LIFF_STORE:2006252489-XlDxGl4V:accessToken"
  );

  if (!accessToken) return false;

  return !!accessToken;
};

const PrivateRoute = ({ isSigned }: { isSigned: boolean }) => {
  return isSigned ? <DLayout /> : <Navigate to="/login" />;
};

const PrivateRouteForStudent = () => {
  const isSignedForStudent = isStudentLoggedIn();

  return isSignedForStudent ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/student/login" replace />
  );
};

// Public route for users
const PublicRoute = ({ isSigned }: { isSigned: boolean }) => {
  return !isSigned ? <Outlet /> : <Navigate to="/" />;
};

export default function AppRoutes() {
  const { isSigned } = useAuth(); // Check teacher login status

  return (
    <Router>
      <Routes>
        {/* Routes for teachers */}
        <Route element={<PrivateRoute isSigned={isSigned} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subject/:subject_id" element={<SubjectDetail />} />
          <Route path="/create-room/:subject_id" element={<CreateRoom />} />
          <Route path="/attendance" element={<ScanQRForAttendance />} />
          <Route path="/room-history/:room_id" element={<RoomAttHistory />} />
          <Route
            path="/attendance/room/subject/:subject_id"
            element={<RoomList />}
          />
        </Route>

        {/* Routes for students */}
        <Route element={<PrivateRouteForStudent />}>
          <Route path="/student/login/callback" element={<AttendanceRoom />} />
          <Route path="/test" element={<AttendanceRoom />} />
          <Route path="/student/checkin" element={<AttendanceSuccess />} />
        </Route>

        {/* Public routes */}
        <Route element={<PublicRoute isSigned={isSigned} />}>
          <Route path="/student/line" element={<AttendanceRoom />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route
            path="/attendance/student/:subject_id/:room_id"
            element={<StudentLogin />}
          />
        </Route>

        {/* Route for handling 404 */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
