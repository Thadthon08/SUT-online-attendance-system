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

// ฟังก์ชันเพื่อตรวจสอบว่านักศึกษาล็อกอินหรือไม่
const isStudentLoggedIn = () => {
  const token = localStorage.getItem("line_access_token"); // ตรวจสอบการมี token
  return !!token; // หากมี token คืนค่า true; หากไม่คืนค่า false
};

// เส้นทางล็อกอินส่วนตัวของอาจารย์
const PrivateRoute = ({ isSigned }: { isSigned: boolean }) => {
  return isSigned ? <DLayout /> : <Navigate to="/login" />;
};

// เส้นทางล็อกอินส่วนตัวของนักเรียน
const PrivateRouteForStudent = () => {
  const isSignedForStudent = isStudentLoggedIn(); // ใช้ฟังก์ชันเพื่อตรวจสอบการล็อกอินของนักเรียน

  return isSignedForStudent ? (
    <>
      <NavbarStudent /> {/* แสดง Layout ของนักเรียน */}
      <Outlet /> {/* Render child components if signed in */}
    </>
  ) : (
    <Navigate to="/student/login" replace /> // Redirect to student login page if not signed in
  );
};

// เส้นทาง Public สำหรับผู้ใช้ทั่วไป
const PublicRoute = ({ isSigned }: { isSigned: boolean }) => {
  return !isSigned ? <Outlet /> : <Navigate to="/" />;
};

export default function AppRoutes() {
  const { isSigned } = useAuth(); // ตรวจสอบการล็อกอินของอาจารย์

  return (
    <Router>
      <Routes>
        {/* เส้นทางสำหรับอาจารย์ */}
        <Route element={<PrivateRoute isSigned={isSigned} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subject/:subject_id" element={<SubjectDetail />} />
          <Route path="/create-room/:subject_id" element={<CreateRoom />} />
          <Route path="/attendance" element={<ScanQRForAttendance />} />
        </Route>

        {/* เส้นทางสำหรับนักเรียน */}
        <Route element={<PrivateRouteForStudent />}>
          <Route
            path="/attendance/student/:subject_id/:room_id"
            element={<StudentAttendance />}
          />
        </Route>

        {/* เส้นทางสำหรับ Public */}
        <Route element={<PublicRoute isSigned={isSigned} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/line" element={<AttendanceRoom />} />
        </Route>

        {/* เส้นทางเมื่อไม่พบหน้า */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
