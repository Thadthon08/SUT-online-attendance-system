import { Form, Input, Button, DatePicker } from "antd";
import moment from "moment";
import { useGeolocation } from "react-use";
import { useParams } from "react-router-dom";

const CheckInRoomForm = () => {
  const { subject_id = "" } = useParams<{ subject_id: string | undefined }>();
  const teacherId = localStorage.getItem("teacher_id")?.replace(/"/g, "") || "";
  const state = useGeolocation();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const { latitude, longitude } = state;
    const creatAt = values.createdTime.format("YYYY-MM-DD HH:mm:ss");
    console.log("Form values:", values);
    console.log("Geolocation:", latitude);
    console.log("Geolocation:", longitude);
    console.log("subject_id:", subject_id);
    console.log("teacher_id:", teacherId);
    console.log("created_at:", creatAt);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        createdTime: moment(),
        subjectID: subject_id,
        teacherID: teacherId,
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
        name="createdTime"
        label="Created Time"
        rules={[{ required: true, message: "Please input the created time!" }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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
