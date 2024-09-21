import React, { useEffect, useState } from "react";
import { GetStudentsByRoomId } from "../../services/api";
import { Student } from "../../interface/IAttendanceRoomresponse";
import { Spin, Alert, Button, Table } from "antd";
import { writeFile, utils } from "xlsx";
import "./RoomAttHistory.css";
import { useParams } from "react-router-dom";
import { Box, Container, Text } from "@chakra-ui/react";

const RoomAttHistory: React.FC = () => {
  // const [roomId] = useState<string>("110");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { room_id } = useParams<{ room_id: any }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (room_id) {
        const result = await GetStudentsByRoomId(room_id);

        if (result.status && result.data) {
          setStudents(result.data.students);
          setError(null);
        } else {
          setError(result.message || "Failed to fetch students");
        }
      } else {
        setError("Room ID is undefined");
      }

      setLoading(false);
    };

    fetchData();
  }, [room_id]);

  const handleExport = () => {
    const worksheet = utils.json_to_sheet(
      students.map((student) => ({
        "Student ID": student.student_id,
        "First Name": student.first_name,
        "Last Name": student.last_name,
        Latitude: student.location_lat,
        Longitude: student.location_lon,
      }))
    );
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Students");

    writeFile(workbook, `Attendance_Room_${room_id}.xlsx`);
  };

  const columns = [
    { title: "Student ID", dataIndex: "student_id", key: "student_id" },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    { title: "Latitude", dataIndex: "location_lat", key: "location_lat" },
    { title: "Longitude", dataIndex: "location_lon", key: "location_lon" },
  ];

  return (
    <Box p={4}>
      <Container
        maxW={{ base: "100%", md: "container.lg" }}
        className="no-copy-no-select"
        mt={6}
      >
        <Box
          border={"1px solid rgba(69, 69, 71,0.2)"}
          bg={"white"}
          mb={5}
          display={"flex"}
          alignItems={"center"}
          p={5}
        >
          <Text fontWeight={"bold"} fontSize={"1.5rem"}>
            Student Attendance Records
          </Text>
        </Box>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleExport} type="primary">
            Export to Excel
          </Button>
        </div>
        <Box
          border={"1px solid rgba(69, 69, 71,0.2)"}
          p={0}
          bg={"white"}
          mt={5}
        >
          {loading ? (
            <Spin tip="Loading..." />
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <Table
              bordered
              columns={columns}
              dataSource={students}
              rowKey="student_id"
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default RoomAttHistory;
