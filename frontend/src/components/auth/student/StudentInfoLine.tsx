import React, { useState } from "react";
import { Form, Input, Button } from "antd";

const StudentInfoForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);

    // บันทึกข้อมูลนักศึกษาไปยัง backend
    fetch("http://localhost:8080/student/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        // บันทึกข้อมูลนักศึกษาใน localStorage
        localStorage.setItem("student_id", data.student_id);
        localStorage.setItem("firstname", data.firstname);
        localStorage.setItem("lastname", data.lastname);
        setLoading(false);
        // เปลี่ยนเส้นทางไปยังหน้าหลักของนักเรียน
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
