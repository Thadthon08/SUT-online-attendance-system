import React, { useEffect, useState } from "react";
import { AttendanceRoom as Attendance } from "../../../interface/IAttendanceRoom";
import {
  CreateAttendanceByStudent,
  GetAttendanceRoom,
} from "../../../services/api";

const AttendanceRoom: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<any | null>(null);
  const [attendanceRoom, setAttendanceRoom] = useState<Attendance | null>(null);
  const [distance] = useState<number | null>(null);
  // Form state
  const [studentId, setStudentId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [locationLat, setLocationLat] = useState<number>(0);
  const [locationLon, setLocationLon] = useState<number>(0);

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
          setAttendanceRoom(roomData ? roomData.data : null);
          console.log("Fetched attendance room data:", roomData);
        } catch (error) {
          console.error("Error fetching attendance room:", error);
        }
      }
    };

    fetchAttendanceRoom();
    console.log("attRoom :", attendanceRoom);
  }, [roomId, subjectId, locationLat, locationLon]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
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
