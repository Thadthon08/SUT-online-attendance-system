import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Spin } from "antd";
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
import liff from "@line/liff";

const AttendanceRoom: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [attendanceRoom, setAttendanceRoom] = useState<Attendance | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

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
    const storedSubjectId = localStorage.getItem("subject_id");
    const storedRoomId = localStorage.getItem("room_id");

    setSubjectId(storedSubjectId);
    setRoomId(storedRoomId);

    liff.init({ liffId: "2006252489-XlDxGl4V" }, () => {
      if (liff.isLoggedIn()) {
        liff.getProfile().then((profile) => {
          localStorage.setItem("user_id", profile.userId);
          localStorage.setItem("user_name", profile.displayName);
          console.log("User ID:");
        });
      } else {
        liff.login();
      }
    });

    // ตรวจสอบสถานะการลงชื่อ
    const attendanceChecked = localStorage.getItem(
      `attendance_checked_${storedRoomId}`
    );
    if (attendanceChecked) {
      navigate("/student/checkin"); // ถ้าลงชื่อแล้ว ให้ไปที่หน้า success
    }

    // Get initial geolocation
    resetPosition();
  }, []);

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

    fetchAttendanceRoom();
  }, [roomId]);

  useEffect(() => {
    // เช็คว่าถ้า roomId เปลี่ยน จะต้องล้างสถานะการลงชื่อ
    const currentRoomId = localStorage.getItem("room_id");
    if (roomId !== currentRoomId) {
      localStorage.removeItem(`attendance_checked_${currentRoomId}`);
      localStorage.setItem("room_id", roomId || ""); // Update roomId in localStorage
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
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const attendanceChecked = localStorage.getItem(
      `attendance_checked_${roomId}`
    );
    if (attendanceChecked) {
      showErrorNotification("Error", "คุณได้ลงชื่อไปแล้ว");
      return;
    }

    if (attendanceRoom && locationLat && locationLon) {
      const currentDistance = calculateDistance(
        locationLat,
        locationLon,
        attendanceRoom.location_lat,
        attendanceRoom.location_lon
      );

      setDistance(currentDistance);

      if (currentDistance > 1) {
        showErrorNotification(
          "ระยะเกินกำหนด",
          `ระยะทางที่คุณอยู่คือ ${currentDistance.toFixed(2)} กม.`
        );
        return;
      }
    }

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

    const data: any = {
      student_id: studentId,
      first_name: firstname,
      last_name: lastname,
      room_id: parseInt(roomId as string),
      location_lat: locationLat,
      location_lon: locationLon,
      line_id: localStorage.getItem("user_id") || "",
    };

    try {
      const result = await CreateAttendanceByStudent(data);
      if (result.status) {
        showSuccessNotification(
          "ลงชื่อสำเร็จ",
          `คุณ ${firstname} ${lastname} ได้ลงชื่อเข้าห้องเรียนแล้ว`
        );
        localStorage.setItem(`attendance_checked_${roomId}`, "true"); // บันทึกสถานะการลงชื่อ
        navigate("/student/checkin");
      } else {
        showErrorNotification(
          "เกิดข้อผิดพลาด",
          result.message || "ไม่สามารถลงชื่อได้"
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="h-screen w-screen container-custom">
      <div className="p-8 bg-white shadow-lg rounded-sm w-custom">
        <h1 className="text-xl font-bold text-center mb-4 text-black ">
          เช็คชื่อเข้าห้องเรียน
        </h1>
        {subjectId && roomId ? (
          <div>
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
              <Spin tip="กำลังดึงข้อมูลพิกัดที่อยู่ปัจจุบัน กรุณารอสักครู่...">
                <Alert style={{ height: "150px" }} type="info" />
              </Spin>
            )}
          </div>
        ) : (
          <p className=" text-center text-red-500 text-sm">
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
