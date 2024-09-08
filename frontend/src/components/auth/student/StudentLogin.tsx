import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import { ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";

const StudentLogin: React.FC = () => {
  const LIFF_ID = "2006252489-XlDxGl4V"; // LIFF ID ของคุณ
  const [profile, setProfile] = useState<any>(null);

  const { subject_id, room_id } = useParams<{
    subject_id: string;
    room_id: string;
  }>();

  useEffect(() => {
    // ตรวจสอบว่า subject_id และ room_id ถูกต้องหรือไม่
    console.log("Subject ID:", subject_id);
    console.log("Room ID:", room_id);

    // เก็บค่า subject_id และ room_id ลงใน localStorage
    if (subject_id && room_id) {
      localStorage.setItem("subject_id", subject_id);
      localStorage.setItem("room_id", room_id);
    }

    // Initialize LIFF SDK
    liff
      .init({ liffId: LIFF_ID })
      .then(() => {
        console.log("LIFF initialized successfully");
        if (liff.isLoggedIn()) {
          fetchUserProfile(); // ถ้าล็อกอินแล้ว ให้ดึงข้อมูลโปรไฟล์ผู้ใช้
        } else {
          handleLineLogin(); // ถ้ายังไม่ล็อกอิน ให้เรียกฟังก์ชัน login
        }
      })
      .catch((err) => {
        console.error("LIFF Initialization failed", err);
        alert("Failed to initialize LINE login. Please try again.");
      });
  }, []);

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
      fetchUserProfile(); // ถ้าล็อกอินแล้ว ให้ดึงข้อมูลโปรไฟล์ผู้ใช้
    }
  };

  const fetchUserProfile = async () => {
    if (liff.isLoggedIn()) {
      try {
        const profile = await liff.getProfile();
        console.log(profile); // แสดงข้อมูลโปรไฟล์ผู้ใช้
        const accessToken = liff.getAccessToken();
        if (accessToken) {
          localStorage.setItem("line_access_token", accessToken);
          setProfile(profile); // เก็บข้อมูลโปรไฟล์ผู้ใช้ใน state
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Unable to fetch profile information. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {profile ? ( // แสดงข้อมูลโปรไฟล์เมื่อผู้ใช้ล็อกอินแล้ว
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
            onClick={() => liff.logout()} // ฟังก์ชัน Logout
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
