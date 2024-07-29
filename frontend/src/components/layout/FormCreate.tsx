import React from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import moment from "moment";

const { Option } = Select;

const CheckInRoomForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    // Here you would handle form submission, e.g., send data to your backend.
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        status: "open",
        createdTime: moment(),
      }}
    >
      <Form.Item
        name="subjectID"
        label="Subject ID"
        rules={[{ required: true, message: "Please input the subject ID!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="teacherID"
        label="Teacher ID"
        rules={[{ required: true, message: "Please input the teacher ID!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="latitude"
        label="Latitude"
        rules={[{ required: true, message: "Please input the latitude!" }]}
      >
        <Input type="number" step="any" />
      </Form.Item>
      <Form.Item
        name="longitude"
        label="Longitude"
        rules={[{ required: true, message: "Please input the longitude!" }]}
      >
        <Input type="number" step="any" />
      </Form.Item>
      <Form.Item
        name="createdTime"
        label="Created Time"
        rules={[{ required: true, message: "Please input the created time!" }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item
        name="endTime"
        label="End Time"
        rules={[{ required: true, message: "Please input the end time!" }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select the status!" }]}
      >
        <Select>
          <Option value="open">Open</Option>
          <Option value="closed">Closed</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="qrCode"
        label="QR Code"
        rules={[{ required: true, message: "Please input the QR code!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CheckInRoomForm;
