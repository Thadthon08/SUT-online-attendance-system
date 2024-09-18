import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Flex } from "antd";
import { AttendanceRoom as Attendance } from "../../../interface/IAttendanceRoom";
import {
  CreateAttendanceByStudent,
  GetAttendanceRoom,
} from "../../../services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../utils/notifications";
import AttendanceForm from "./AttendanceForm";
import MapComponent from "./MapComponent";
import "./attendanceRoom.css";
import liff from "@line/liff"; // Import LIFF SDK

const AttendanceRoom: React.FC = () => {
  const LIFF_ID = "2006252489-XlDxGl4V"; // Replace with your LIFF ID
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [attendanceRoom, setAttendanceRoom] = useState<Attendance | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [ setProfile] = useState<any>(null);

  // Form state
  const [studentId, setStudentId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [locationLat, setLocationLat] = useState<number>();
  const [locationLon, setLocationLon] = useState<number>();
  const navigate = useNavigate();

  const resetPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationLat(position.coords.latitude);
          setLocationLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error resetting position:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: LIFF_ID });
        console.log("LIFF initialized successfully");

        if (liff.isLoggedIn()) {
          const accessToken = liff.getAccessToken();
          if (accessToken) {
            localStorage.setItem("line_access_token", accessToken);
            const userProfile = await liff.getProfile();
            setProfile(userProfile);
            console.log("LINE ID:", userProfile.userId);
            localStorage.setItem("line_user_id", userProfile.userId);
            localStorage.setItem("line_display_name", userProfile.displayName);
          } else {
            console.error("Access token is not available.");
          }
        } else {
          liff.login();
        }
      } catch (err) {
        console.error("LIFF Initialization failed", err);
        alert("Failed to initialize LINE login. Please try again.");
      }
    };

    const storedSubjectId = localStorage.getItem("subject_id");
    const storedRoomId = localStorage.getItem("room_id");

    setSubjectId(storedSubjectId);
    setRoomId(storedRoomId);

    const attendanceChecked = localStorage.getItem(
      `attendance_checked_${storedRoomId}`
    );
    if (attendanceChecked) {
      navigate("/student/checkin");
    }

    resetPosition();
    initializeLiff();
  }, [navigate]);

  useEffect(() => {
    const fetchAttendanceRoom = async () => {
      if (roomId) {
        try {
          const roomData = await GetAttendanceRoom(roomId);
          setAttendanceRoom(roomData.data);
          console.log("Fetched attendance room data:", roomData);
        } catch (error) {
          console.error("Error fetching attendance room:", error);
        }
      }
    };

    if (roomId) {
      fetchAttendanceRoom();
    }
  }, [roomId]);

  useEffect(() => {
    if (attendanceRoom && locationLat && locationLon) {
      const currentDistance = calculateDistance(
        locationLat,
        locationLon,
        attendanceRoom.location_lat,
        attendanceRoom.location_lon
      );
      setDistance(currentDistance);
      console.log("Calculated Distance: ", currentDistance);
    }
  }, [attendanceRoom, locationLat, locationLon]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!roomId || !subjectId) {
      showErrorNotification("Error", "กรุณาสแกน QR Code ใหม่อีกครั้ง");
      return;
    }

    if (!locationLat || !locationLon) {
      showErrorNotification(
        "ไม่สามารถระบุตำแหน่งของคุณได้",
        "กรุณาอนุญาตให้เข้าถึงตำแหน่งของคุณ"
      );
      return;
    }

    const currentDistance = distance || 0;
    if (currentDistance > 1) {
      showErrorNotification(
        "ระยะเกินกำหนด",
        `ระยะทางที่คุณอยู่คือ ${currentDistance.toFixed(2)} กม.`
      );
      return;
    }

    const data = {
      student_id: studentId,
      first_name: firstname,
      last_name: lastname,
      room_id: parseInt(roomId as string),
      location_lat: locationLat,
      location_lon: locationLon,
    };

    try {
      const result = await CreateAttendanceByStudent(data);
      if (result.status) {
        showSuccessNotification(
          "ลงชื่อสำเร็จ",
          `ระยะทางที่คุณอยู่คือ ${currentDistance.toFixed(2)} กม.`
        );
        localStorage.setItem(`attendance_checked_${roomId}`, "true");
        navigate("/student/checkin");
      } else {
        console.error("Error creating attendance:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="h-screen w-screen container-custom">
      <div className="p-8 bg-white shadow-lg rounded-sm w-custom">
        <h1 className="text-xl font-bold text-center mb-4 text-black font-medium">
          เช็คชื่อเข้าห้องเรียน
        </h1>
        {subjectId && roomId ? (
          <>
            <p className="text-md text-center">
              <strong>รหัสวิชา:</strong> {subjectId}
            </p>
            {distance !== null && (
              <p className="text-sm text-center">
                <strong>Distance to Room:</strong>{" "}
                <span className="text-red-500 font-bold">
                  {distance.toFixed(2)} km
                </span>
              </p>
            )}
            {locationLat && locationLon ? (
              <MapComponent
                locationLat={locationLat}
                locationLon={locationLon}
                attendanceRoom={attendanceRoom}
                resetPosition={resetPosition}
              />
            ) : (
              <Flex className="mt-1" gap="middle" vertical>
                <Alert
                  message="Location not found"
                  description="กรุณาอนุญาตให้เข้าถึงตำแหน่งของคุณ"
                  type="error"
                  className="text-custom"
                />
              </Flex>
            )}
          </>
        ) : (
          <p className="text-lg text-center text-red-500 text-sm">
            กรุณาสแกน QR Code ใหม่อีกครั้ง
          </p>
        )}
        <AttendanceForm
          studentId={studentId}
          firstname={firstname}
          lastname={lastname}
          onStudentIdChange={(e) => setStudentId(e.target.value)}
          onFirstnameChange={(e) => setFirstname(e.target.value)}
          onLastnameChange={(e) => setLastname(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AttendanceRoom;
