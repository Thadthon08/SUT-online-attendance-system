import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { LineLoginButton } from "react-line-login"; // สมมติว่ามี package นี้
import StudentInfoForm from "./StudentInfoForm";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // ตรวจสอบว่าเคยมีข้อมูลนักศึกษาใน localStorage หรือยัง
    const studentId = localStorage.getItem("student_id");
    if (studentId) {
      setIsFirstTime(false); // ถ้ามีข้อมูลนักศึกษาแสดงว่าไม่ใช่ครั้งแรก
      navigate("/attendance"); // เปลี่ยนเส้นทางไปยังหน้าเช็คชื่อ
    }
  }, [navigate]);

  const handleLineLoginSuccess = (profile: any) => {
    // จัดการหลังจาก Line Login สำเร็จ
    // บันทึก token ลง localStorage หรือ sessionStorage
    localStorage.setItem("line_token", profile.token);

    // ตรวจสอบว่าผู้ใช้เป็นครั้งแรกหรือไม่
    const studentId = localStorage.getItem("student_id");
    if (!studentId) {
      setIsFirstTime(true); // แสดงฟอร์มกรอกข้อมูล
    } else {
      navigate("/attendance"); // ถ้าไม่ใช่ครั้งแรก ไปหน้าเช็คชื่อเลย
    }
  };

  return (
    <div>
      <h1>Login with LINE</h1>
      {/* <LineLoginButton
        clientID="<LINE_CLIENT_ID>"
        redirectURI="https://yourapp.com/line/callback"
        state="<some_random_string>"
        scope="profile openid"
        onLoginSuccess={handleLineLoginSuccess}
        onLoginFailure={(error: any) => console.error("Login Failed: ", error)}
      /> */}
      {isFirstTime && <StudentInfoForm />} {/* แสดงฟอร์มถ้าเป็นครั้งแรก */}
    </div>
  );
};

export default StudentLogin;
