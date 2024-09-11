import React, { useEffect, useState } from "react";
import { AttendanceRoom as Attendance } from "../../../interface/IAttendanceRoom";
import {
  CreateAttendanceByStudent,
  GetAttendanceRoom,
} from "../../../services/api";
import { showErrorNotification, showSuccessNotification } from '../../../utils/notifications';

const AttendanceRoom: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<any | null>(null);
  const [attendanceRoom, setAttendanceRoom] = useState<Attendance | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Form state
  const [studentId, setStudentId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [locationLat, setLocationLat] = useState<number>();
  const [locationLon, setLocationLon] = useState<number>();

  useEffect(() => {
    const storedSubjectId = localStorage.getItem("subject_id");
    const storedRoomId = localStorage.getItem("room_id");

    setSubjectId(storedSubjectId);
    setRoomId(storedRoomId);

    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationLat(position.coords.latitude);
          setLocationLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
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
  }, [roomId, subjectId]);

  useEffect(() => {
    if (attendanceRoom) {
      const roomLat = attendanceRoom.location_lat;
      const roomLon = attendanceRoom.location_lon;

      if (locationLat && locationLon) {
        const currentDistance = calculateDistance(
          locationLat,
          locationLon,
          roomLat,
          roomLon
        );

        setDistance(currentDistance);
        console.log("Calculated Distance: ", currentDistance);
      }
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
  
    if (attendanceRoom) {
      const roomLat = attendanceRoom.location_lat;
      const roomLon = attendanceRoom.location_lon;
  
      if (locationLat && locationLon) {
        const currentDistance = calculateDistance(
          locationLat,
          locationLon,
          roomLat,
          roomLon
        );
  
        setDistance(currentDistance);
  
        if (currentDistance > 1) {
          // Show error notification if distance is greater than 1 km
          showErrorNotification("ระยะเกินกำหนด", `ระยะทางที่คุณอยู่คือ ${currentDistance.toFixed(2)} กม.`);
          return; // Exit if the distance is too great
        } else {
          // Show success notification if distance is within 1 km
          showSuccessNotification("ลงชื่อสำเร็จ", `ระยะทางที่คุณอยู่คือ ${currentDistance.toFixed(2)} กม.`);
        }
      }
    }
  
    const data: any = {
      student_id: studentId,
      first_name: firstname,
      last_name: lastname,
      room_id: parseInt(roomId),
      location_lat: locationLat,
      location_lon: locationLon,
    };
  
    try {
      const result = await CreateAttendanceByStudent(data);
      if (result.status) {
        console.log("Attendance created successfully:", result.message);
      } else {
        console.error("Error creating attendance:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  
  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center mb-4">Attendance Room</h1>
      {subjectId && roomId ? (
        <div>
          <p className="text-lg text-center">
            <strong>Subject ID:</strong> {subjectId}
          </p>
          <p className="text-lg text-center">
            <strong>Room ID:</strong> {roomId}
          </p>
          {distance !== null && (
            <p className="text-lg text-center">
              <strong>Distance to Room:</strong> {distance.toFixed(2)} km
            </p>
          )}
        </div>
      ) : (
        <p className="text-lg text-center text-red-500">
          Missing subject or room information.
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="mb-4">
          <label
            htmlFor="student_id"
            className="block text-lg font-medium mb-2"
          >
            Student ID
          </label>
          <input
            id="student_id"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="firstname" className="block text-lg font-medium mb-2">
            First Name
          </label>
          <input
            id="firstname"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastname" className="block text-lg font-medium mb-2">
            Last Name
          </label>
          <input
            id="lastname"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AttendanceRoom;
