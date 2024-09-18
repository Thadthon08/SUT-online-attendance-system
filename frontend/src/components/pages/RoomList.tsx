import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { GetAttendanceRoomBySubjectID } from "../../services/api";
import { AttendanceRoom } from "../../interface/IAttendanceRoom";

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<AttendanceRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { subject_id } = useParams<{ subject_id: string }>();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        if (subject_id) {
          const result = await GetAttendanceRoomBySubjectID(subject_id);
          console.log("API Response:", result.data.data); // Log to inspect response
          
          setRooms(result.data.data);
          console.log(rooms);
        } else {
          setError("Subject ID is missing");
        }
      } catch (err) {
        console.error("Fetch error:", err); // Log the error
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRooms();
  }, [subject_id]); // Trigger fetch when subject_id changes
  

  const handleViewDetails = (roomId: number) => {
    if (roomId) {
      navigate(`/room-history/${roomId}`);
    } else {
      console.error("Room ID is undefined or invalid");
    }
  };

  const columns = [
    { title: "Room ID", dataIndex: "room_id", key: "room_id" },
    { title: "Room Name", dataIndex: "room_name", key: "room_name" },
    { title: "Start Time", dataIndex: "start_time", key: "start_time" },
    { title: "End Time", dataIndex: "end_time", key: "end_time" },
    {
      title: "Action",
      key: "action",
      render: (_text: any, record: AttendanceRoom) => (
        <Button onClick={() => record.room_id !== undefined && handleViewDetails(record.room_id)}>
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
        <Table 
          columns={columns} 
          dataSource={rooms} 
          rowKey={(rooms) => (rooms.room_id ? rooms.room_id.toString() : 'default-key')} 
        />
      )}
    </div>
  );
};

export default RoomList;
