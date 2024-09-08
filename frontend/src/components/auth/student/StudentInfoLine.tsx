import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";

const StudentInfoForm = () => {
  const [loading, setLoading] = useState(false);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    // Extract subject_id and room_id from the path
    const pathParts = window.location.pathname.split("/");

    // Assuming the URL is like: /attendance/student/523315/86
    const subjectIdFromPath = pathParts[3]; // The 4th element in the array is the subject_id
    const roomIdFromPath = pathParts[4];    // The 5th element in the array is the room_id

    // Log extracted values for debugging
    console.log("Subject ID:", subjectIdFromPath);
    console.log("Room ID:", roomIdFromPath);

    setSubjectId(subjectIdFromPath);
    setRoomId(roomIdFromPath);
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);

    // Combine the form values with the extracted subject_id and room_id
    const payload = {
      ...values,
      subject_id: subjectId,
      room_id: roomId,
    };

    // Send the student info to the backend
    fetch("http://localhost:8080/student/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // Save student info in localStorage
        localStorage.setItem("student_id", data.student_id);
        localStorage.setItem("firstname", data.firstname);
        localStorage.setItem("lastname", data.lastname);
        setLoading(false);
        // Redirect to the attendance page
        window.location.href = "/attendance";
      })
      .catch((error) => {
        console.error("Error saving student info:", error);
        setLoading(false);
      });
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Student ID"
        name="student_id"
        rules={[{ required: true, message: "Please input your Student ID!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="First Name"
        name="firstname"
        rules={[{ required: true, message: "Please input your First Name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastname"
        rules={[{ required: true, message: "Please input your Last Name!" }]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Save
      </Button>
    </Form>
  );
};

export default StudentInfoForm;
