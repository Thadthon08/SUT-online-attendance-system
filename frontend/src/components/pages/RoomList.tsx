import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom"; // For navigation
import { GetAttendanceRoomBySubjectID } from "../../services/api"; // Import your API function

interface AttendanceRoom {
  room_id: number;
  subject_id: string;
  room_name: string;
  start_time: string;
  end_time: string;
  location_lat: number;
  location_lon: number;
}

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<AttendanceRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const result = await GetAttendanceRoomBySubjectID("subject_id"); // Fetch with an empty ID initially if needed
        console.log(result);
        if (result.status && result.data) {
          setRooms(result.data); // Assuming result.data is an array of AttendanceRoom
          setError(null);
        } else {
          setError(result.message || "Failed to fetch rooms");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleViewDetails = (roomId: number) => {
    navigate(`/room-attendance/${roomId}`); // Navigate to RoomAttHistory with roomId
  };

  const columns = [
    { title: "Room Name", dataIndex: "room_name", key: "room_name" },
    { title: "Start Time", dataIndex: "start_time", key: "start_time" },
    { title: "End Time", dataIndex: "end_time", key: "end_time" },
    {
      title: "Action",
      key: "action",
      render: (_text: any, record: AttendanceRoom) => (
        <Button onClick={() => handleViewDetails(record.room_id)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Room List</h1>
      {loading ? (
        <Spin tip="Loading..." />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Table columns={columns} dataSource={rooms} rowKey="room_id" />
      )}
    </div>
  );
};

export default RoomList;
