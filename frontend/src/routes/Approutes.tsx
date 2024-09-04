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
import StudentInfoForm from "../components/auth/student/StudentInfoForm";

const PrivateRoute = ({ isSigned }: { isSigned: boolean }) => {
  return isSigned ? (
    <>
      <DLayout />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const PrivateRouteForStudent = ({ isSigned }: { isSigned: boolean }) => {
  return isSigned ? (
    <>
      <NavbarStudent />
    </>
  ) : (
    <Navigate to="/student/login" /> // ปรับเปลี่ยนเส้นทางไปที่หน้าล็อกอินของนักเรียน
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
        {/* เส้นทางสำหรับอาจารย์ */}
        <Route element={<PrivateRoute isSigned={isSigned} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subject/:subject_id" element={<SubjectDetail />} />
          <Route path="/create-room/:subject_id" element={<CreateRoom />} />
          <Route
            path="/attendance/:subject_id/:room_id"
            element={<ScanQRForAttendance />}
          />
        </Route>

        {/* เส้นทางสำหรับนักเรียน */}
        <Route element={<PrivateRouteForStudent isSigned={isSigned} />}>
          <Route
            path="/attendance/student/:subject_id/:room_id"
            element={<StudentAttendance />}
          />
        </Route>

        {/* เส้นทางสำหรับ Public */}
        <Route element={<PublicRoute isSigned={isSigned} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/info" element={<StudentInfoForm />} />{" "}
          {/* ฟอร์มกรอกข้อมูลนักศึกษา */}
        </Route>

        {/* เส้นทางเมื่อไม่พบหน้า */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
