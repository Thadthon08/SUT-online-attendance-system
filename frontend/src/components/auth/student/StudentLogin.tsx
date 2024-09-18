import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import { ArrowRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { GetAttendanceRoom } from "../../../services/api";

const StudentLogin: React.FC = () => {
  const [profile] = useState<any>(null);
  const navigate = useNavigate();
  const { subject_id, room_id } = useParams<{
    subject_id: string;
    room_id: string;
  }>();

  liff.init({ liffId: "2006252489-XlDxGl4V" }, () => {
    if (liff.isLoggedIn()) {
      console.log("User is logged in");
    } else {
      liff.login();
    }
  });

  useEffect(() => {
    const initialize = async () => {
      if (subject_id && room_id) {
        const result = await GetAttendanceRoom(room_id);

        if (!result.status) {
          navigate("/page-not-found");
          return;
        }

        localStorage.setItem("subject_id", subject_id);
        localStorage.setItem("room_id", room_id);
      }
    };

    initialize();
  }, [room_id, subject_id, navigate]);

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
