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
import StudentAttendance from "../components/pages/StudentAttendance";
import NavbarStudent from "../components/layout/StudentLayout/Navbar";
import StudentLogin from "../components/auth/student/StudentLogin";
import StudentInfoForm from "../components/auth/student/StudentInfoLine";
import AttendanceRoom from "../components/pages/StudentPage/AttendanceRoom";

// Function to check if the student is logged in based on codeVerifier
const isStudentLoggedIn = () => {
  // Retrieve the LIFF login temporary data from localStorage
  const liffLoginTmp = localStorage.getItem('LIFF_STORE:2006252489-XlDxGl4V:loginTmp');

  if (!liffLoginTmp) return false; // Return false if login data is not available

  try {
    const loginData = JSON.parse(liffLoginTmp); // Parse the login data
    const codeVerifier = loginData?.codeVerifier; // Safely extract codeVerifier

    // Check if the codeVerifier exists and is valid
    return !!codeVerifier; // Return true if codeVerifier exists; otherwise false
  } catch (error) {
    console.error('Failed to parse LIFF login temporary data:', error);
    return false; // Return false in case of any parsing errors
  }
};

// Private route for teachers
const PrivateRoute = ({ isSigned }:{isSigned:boolean}) => {
  return isSigned ? <DLayout /> : <Navigate to="/login" />;
};

// Private route for students
const PrivateRouteForStudent = () => {
  const isSignedForStudent = isStudentLoggedIn(); // Check if student is logged in

  return isSignedForStudent ? (
    <>
      <NavbarStudent /> {/* Show student layout */}
      <Outlet /> {/* Render child components if signed in */}
    </>
  ) : (
    <Navigate to="/student/login" replace /> // Redirect to student login page if not signed in
  );
};

// Public route for users
const PublicRoute = ({ isSigned }:{isSigned:boolean}) => {
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
        </Route>

        {/* Routes for students */}
        <Route element={<PrivateRouteForStudent />}>
          <Route path="/student/line" element={<AttendanceRoom />} />
          <Route
            path="/attendance/student/:subject_id/:room_id"
            element={<StudentAttendance />}
          />
        </Route>

        {/* Public routes */}
        <Route element={<PublicRoute isSigned={isSigned} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/student/login" element={<StudentLogin />} />
          {/* Add other public routes here */}
        </Route>

        {/* Route for handling 404 */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
