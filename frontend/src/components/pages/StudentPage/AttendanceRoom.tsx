import React, { useEffect, useState } from "react";
import { CreateAttendanceByStudent } from "../../../services/api";

const AttendanceRoom: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<any | null>(null);

  // Form state
  const [studentId, setStudentId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [locationLat, setLocationLat] = useState<number>(0);
  const [locationLon, setLocationLon] = useState<number>(0);

  useEffect(() => {
    // Retrieve subject_id and room_id from localStorage
    const storedSubjectId = localStorage.getItem("subject_id");
    const storedRoomId = localStorage.getItem("room_id");

    // Log values
    console.log("Subject ID from localStorage:", storedSubjectId);
    console.log("Room ID from localStorage:", storedRoomId);

    // Update state
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Log form values
    console.log("Student ID:", studentId);
    console.log("Firstname:", firstname);
    console.log("Lastname:", lastname);

    // Prepare the data to be sent
    const data: any = {
      student_id: studentId,
      first_name: firstname,
      last_name: lastname,
      room_id: parseInt(roomId),
      location_lat: locationLat,
      location_lon: locationLon,
    };

    console.log("data:", data);

    try {
      const result = await CreateAttendanceByStudent(data);
      if (result.status) {
        console.log("Attendance created successfully:", result.message);
        // Optionally, handle successful submission (e.g., redirect or show a message)
      } else {
        console.error("Error creating attendance:", result.message);
        // Optionally, handle errors (e.g., show an error message)
      }
    } catch (error) {
      console.error("Network error:", error);
      // Optionally, handle network errors (e.g., show an error message)
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center mb-4">Attendance Room</h1>
      {/* Display Subject ID and Room ID */}
      {subjectId && roomId ? (
        <div>
          <p className="text-lg text-center">
            <strong>Subject ID:</strong> {subjectId}
          </p>
          <p className="text-lg text-center">
            <strong>Room ID:</strong> {roomId}
          </p>
        </div>
      ) : (
        <p className="text-lg text-center text-red-500">
          Missing subject or room information.
        </p>
      )}
      {/* Form for student details */}
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="mb-4">
          <label htmlFor="student_id" className="block text-lg font-medium mb-2">Student ID</label>
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
          <label htmlFor="firstname" className="block text-lg font-medium mb-2">First Name</label>
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
          <label htmlFor="lastname" className="block text-lg font-medium mb-2">Last Name</label>
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
