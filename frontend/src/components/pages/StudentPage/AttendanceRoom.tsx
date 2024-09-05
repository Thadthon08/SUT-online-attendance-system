import React from "react";
import { useSearchParams } from "react-router-dom";

const AttendanceRoom: React.FC = () => {
  // ใช้ useSearchParams เพื่อดึงค่า student_id และ room_id จาก query parameters
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("student_id");
  const roomId = searchParams.get("room_id");

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center mb-4">Attendance Room</h1>
      {/* แสดง Student ID และ Room ID */}
      {studentId && roomId ? (
        <div>
          <p className="text-lg text-center">
            <strong>Student ID:</strong> {studentId}
          </p>
          <p className="text-lg text-center">
            <strong>Room ID:</strong> {roomId}
          </p>
        </div>
      ) : (
        <p className="text-lg text-center text-red-500">
          Missing student or room information.
        </p>
      )}
    </div>
  );
};

export default AttendanceRoom;
