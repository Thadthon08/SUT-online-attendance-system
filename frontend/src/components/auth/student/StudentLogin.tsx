import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import { ArrowRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom"; // เพิ่ม useNavigate สำหรับการเปลี่ยนหน้า
import { GetAttendanceRoom } from "../../../services/api";

const StudentLogin: React.FC = () => {
  const LIFF_ID = "2006252489-XlDxGl4V"; // LIFF ID ของคุณ
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate(); // ใช้ useNavigate เพื่อเปลี่ยนหน้า
  const { subject_id, room_id } = useParams<{
    subject_id: string;
    room_id: string;
  }>();

  useEffect(() => {
    const initialize = async () => {
      if (subject_id && room_id) {
        // เรียกใช้ GetAttendanceRoom เพื่อตรวจสอบว่า room_id มีอยู่ในฐานข้อมูลหรือไม่
        const result = await GetAttendanceRoom(room_id);

        if (!result.status) {
          // ถ้าไม่พบ room_id ให้เปลี่ยนไปที่หน้า PAGE NOT FOUND
          navigate("/page-not-found");
          return;
        }

        // ถ้าพบ room_id และ subject_id เก็บค่าใน localStorage
        localStorage.setItem("subject_id", subject_id);
        localStorage.setItem("room_id", room_id);
      }

      // Initialize LIFF SDK
      liff
        .init({ liffId: LIFF_ID })
        .then(() => {
          console.log("LIFF initialized successfully");
        })
        .catch((err) => {
          console.error("LIFF Initialization failed", err);
          alert("Failed to initialize LINE login. Please try again.");
        });
    };

    initialize();
  }, [room_id, subject_id, navigate]);

  const handleLineLogin = () => {
    if (!liff.isLoggedIn()) {
      try {
        liff.login();
      } catch (error) {
        console.error("Error logging in with LINE:", error);
        alert(
          "Login failed. Please check your network connection and try again."
        );
      }
    } else {
      fetchUserProfile();
    }
  };

  const fetchUserProfile = async () => {
    if (liff.isLoggedIn()) {
      console.log("User is logged in.");
      try {
        const profile = await liff.getProfile();
        console.log("Profile fetched:", profile); // ตรวจสอบโปรไฟล์ที่ดึงมาได้

        const accessToken = liff.getAccessToken();

        if (accessToken) {
          localStorage.setItem("line_access_token", accessToken);
        }

        // เก็บชื่อและไอดีใน localStorage
        localStorage.setItem("line_display_name", profile.displayName);
        localStorage.setItem("line_user_id", profile.userId);

        // ตรวจสอบว่าข้อมูลถูกบันทึกหรือไม่
        console.log("Display Name:", localStorage.getItem("line_display_name"));
        console.log("User ID:", localStorage.getItem("line_user_id"));

        setProfile(profile); // แสดงข้อมูลโปรไฟล์หลังจากดึงสำเร็จ
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Unable to fetch profile information. Please try again.");
      }
    } else {
      console.log("User is not logged in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {profile ? (
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 transform hover:scale-105 transition-all duration-300 ease-in-out">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Welcome, {profile.displayName}!
          </h1>
          <div className="flex justify-center mb-4">
            <img
              src={profile.pictureUrl}
              alt="User profile"
              className="rounded-full w-24 h-24"
            />
          </div>
          <p className="text-center text-gray-600 mb-8">
            You are now logged in with LINE.
          </p>
          <button
            onClick={() => liff.logout()}
            className="group relative w-full py-3 px-5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 ease-in-out overflow-hidden"
            aria-label="Logout"
          >
            <div className="absolute inset-0 w-3 bg-red-600 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
            <div className="relative flex items-center justify-center">
              <span className="font-semibold">Logout</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 transform hover:scale-105 transition-all duration-300 ease-in-out">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Welcome Back!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Log in to access your student dashboard
          </p>
          <button
            onClick={handleLineLogin} // ฟังก์ชัน Login
            className="group relative w-full py-3 px-5 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 ease-in-out overflow-hidden"
            aria-label="Login with LINE"
          >
            <div className="absolute inset-0 w-3 bg-green-600 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
            <div className="relative flex items-center justify-center">
              <img
                src="https://www.thh-helmets.com.tw/images/LineLoginButtonImage/images/DeskTop/2x/44dp/btn_base.png"
                alt="LINE"
                className="h-6 mr-3"
              />
              <span className="font-semibold">Login with LINE</span>
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>
          <p className="text-center text-gray-500 mt-6 text-sm">
            Don't have a LINE account?{" "}
            <a
              href="https://line.me/en/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign up here
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentLogin;
