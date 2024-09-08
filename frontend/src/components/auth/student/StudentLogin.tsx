import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import { ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";

const StudentLogin: React.FC = () => {
  const LIFF_ID = "2006252489-XlDxGl4V"; // ?????????? LIFF_ID ???????
  const [profile, setProfile] = useState<any>(null);
  const [redirectPath, setRedirectPath] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const { subject_id, room_id } = useParams<{ subject_id: string; room_id: string }>();





  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get("state") || ""; // ?????? state ??? Query Parameter
    setRedirectPath(state); // ???? Path ?????? state

    // ?????? subject_id ??? room_id ??? query parameters
       // Log ค่า subjectId และ roomId เพื่อดูว่าได้ถูกดึงมาอย่างถูกต้องหรือไม่
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
          fetchUserProfile(); // Fetch user profile if already logged in
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
        // ??????? state ??? URL ?????????? redirect ???? login ??????
        const currentUrl = window.location.href;
        const redirectUri = "https://localhost:5173/student/line"; // ??? HTTPS ????????????????????????
        // ??? state ???? currentUrl ???????? redirectUri
        liff.login({
          redirectUri: `${redirectUri}?state=${encodeURIComponent(currentUrl)}`,
        });
      } catch (error) {
        console.error("Error logging in with LINE:", error);
        alert(
          "Login failed. Please check your network connection and try again."
        );
      }
    } else {
      fetchUserProfile(); // Fetch user profile if already logged in
    }
  };

  const fetchUserProfile = async () => {
    if (liff.isLoggedIn()) {
      try {
        const profile = await liff.getProfile();
        console.log(profile); // Display profile information
        const accessToken = liff.getAccessToken();
        if (accessToken) {
          localStorage.setItem("line_access_token", accessToken);
          setProfile(profile); // ??????????????????? state

          // ???????????? subject_id ??? room_id ???????
          let redirectUrl = "/student/line";
          if (subjectId && roomId) {
            redirectUrl = `/student/line?subject_id=${subjectId}&room_id=${roomId}`;
          }

          window.location.href = redirectUrl; // Redirect ????? URL ????????? query parameters
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Unable to fetch profile information. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {profile ? ( // ????????????????????????????????
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
            onClick={() => liff.logout()} // ?????????? Logout
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
            onClick={handleLineLogin} // Login starts when this button is clicked
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
