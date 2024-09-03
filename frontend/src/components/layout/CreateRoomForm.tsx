// components/CreateRoomForm.tsx
import {
  Form,
  Input,
  Button,
  DatePicker,
  Typography,
  Card,
  Row,
  Col,
  Spin,
  Alert,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationMap from "./LocationMap";
import { CreateAttendance } from "../../services/api";
import { AttendanceRoom } from "../../interface/IAttendanceRoom";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/notifications";
import useFetchSubjects from "../../hooks/useFetchSubjects";
import useCurrentLocation from "../../hooks/useCurrentLocation";

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

const { Title } = Typography;

const CreateRoomForm = () => {
  const { subject_id = "" } = useParams<{ subject_id: string }>();
  const [form] = Form.useForm();
  const { subjects } = useFetchSubjects(subject_id);
  const { location } = useCurrentLocation();
  const [roomName, setRoomName] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(1, "hour"));
  const navigate = useNavigate();

  useEffect(() => {
    if (subject_id) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const newRoomName = `${subject_id} เช็คชื่อวันที่ ${formattedDate}`;
      setRoomName(newRoomName);

      form.setFieldsValue({
        roomName: newRoomName,
        createdTime: dayjs().locale("en"),
        endTime: dayjs().add(2, "minute"),
        subjectID: subject_id,
        teacherID: subjects?.teachers?.[0]?.teacher_id,
        subjectName: subjects?.subject_name,
      });
    }
  }, [subject_id, form, subjects]);

  const onFinish = async (values: any) => {
    if (!location || !location.latitude || !location.longitude) {
      showErrorNotification(
        "ไม่สามารถสร้างห้องได้",
        "กรุณาตรวจสอบว่าระบบสามารถดึงข้อมูลพิกัดที่ตั้งได้สำเร็จ"
      );
      return;
    }

    const attendanceData: AttendanceRoom = {
      subject_id: values.subjectID,
      room_name: values.roomName,
      start_time: values.createdTime.tz("Asia/Bangkok").format(),
      end_time: values.endTime.tz("Asia/Bangkok").format(),
      location_lat: location.latitude,
      location_lon: location.longitude,
    };

    try {
      const result = await CreateAttendance(attendanceData);
      if (result.status) {
        showSuccessNotification("สร้างห้องเช็คชื่อสำเร็จ", result.message);
        navigate(`/attendence/${subject_id}/${result.data.room_id}`);
        console.log(result.data);
      } else {
        showErrorNotification("เกิดข้อผิดพลาด", result.message);
      }
    } catch (error) {
      showErrorNotification("เกิดข้อผิดพลาด", "ไม่สามารถสร้างห้องเช็คชื่อได้");
    }
  };

  const disablePastDates = (current: any) =>
    current &&
    (current < dayjs().startOf("day") || current > dayjs().add(1, "month"));

  const disablePastTimes = (current: any) => {
    const currentHour = dayjs().hour();
    const currentMinute = dayjs().minute();
    const hours = current.isSame(dayjs(), "day")
      ? Array.from(Array(currentHour).keys())
      : [];
    const minutes =
      current.isSame(dayjs(), "day") && current.hour() === currentHour
        ? Array.from(Array(currentMinute).keys())
        : [];
    return {
      disabledHours: () => hours,
      disabledMinutes: (selectedHour: any) =>
        selectedHour === currentHour ? minutes : [],
    };
  };

  return (
    <Card
      style={{
        margin: "50px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 8px 10px 1px rgba(0,0,0,0.5)",
        border: "0.35rem solid #000000",
        width: "100%",
        maxWidth: "800px",
      }}
    >
      <Title
        level={3}
        style={{ textAlign: "center", marginBottom: "30px", color: "#000000" }}
      >
        Check-In Room Details
      </Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="subjectName"
              rules={[{ required: true }]}
              label="ชื่อวิชา"
            >
              <Input value={subjects?.subject_name} readOnly />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="subjectID"
              label="รหัสวิชา"
              rules={[{ required: true }]}
            >
              <Input value={subject_id} readOnly />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="roomName"
              label="ชื่อห้อง"
              rules={[{ required: true }]}
            >
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="createdTime"
              label="เวลาเริ่มเช็คชื่อ"
              rules={[{ required: true }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={startTime}
                onChange={(value) => setStartTime(value)}
                style={{ width: "100%" }}
                disabledDate={disablePastDates}
                disabledTime={disablePastTimes}
                onOpenChange={(open) => {
                  if (open) {
                    setStartTime(dayjs().locale("en"));
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="endTime"
              label="เวลาสิ้นสุดเช็คชื่อ"
              rules={[{ required: true }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={endTime}
                onChange={(value) => setEndTime(value)}
                style={{ width: "100%" }}
                disabledDate={disablePastDates}
                disabledTime={disablePastTimes}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="ตำแหน่งปัจจุบัน">
              {!location ? (
                <Spin tip="กำลังดึงข้อมูลพิกัดที่อยู่ปัจจุบัน กรุณารอสักครู่...">
                  <Alert style={{ height: "150px" }} type="info" />
                </Spin>
              ) : (
                <LocationMap center={[location.latitude, location.longitude]} />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: "40px", fontSize: "16px" }}
              >
                Create Room
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateRoomForm;
