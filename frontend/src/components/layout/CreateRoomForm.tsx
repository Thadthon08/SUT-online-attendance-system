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
  notification,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LocationMap from "./LocationMap"; // Import LocationMap
import { getSubjectsByid, CreateAttendance } from "../../services/api"; // Import the API functions
import { Subject } from "../../interface/ITeacherSubject";
import { AttendanceRoom } from "../../interface/IAttendanceRoom"; // Import AttendanceRoom type

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

const { Title } = Typography;

const CreateRoomForm = () => {
  const { subject_id = "" } = useParams<{ subject_id: string }>();
  const [form] = Form.useForm();

  const [roomName, setRoomName] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(1, "hour")); // default end time is 1 hour after start time
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [center, setCenter] = useState<[number, number]>([14.0766, 100.6036]); // Default center
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject>();

  const fetchSubjects = async () => {
    try {
      const data = await getSubjectsByid({ subject_id: subject_id });
      setSubjects(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

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
      });

      form.setFieldsValue({
        createdTime: dayjs().locale("en"), // Use Gregorian calendar
        endTime: dayjs().add(2, "minute"),
        subjectID: subject_id,
        teacherID: subjects?.teachers?.[0]?.teacher_id,
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        setCenter([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError(
          "ไม่สามารถดึงตำแหน่งที่ตั้งได้. กรุณาลองอีกครั้งหรือตรวจสอบการตั้งค่าการเข้าถึงตำแหน่งในเบราว์เซอร์ของคุณ."
        );
      }
    );

    fetchSubjects();
  }, [subject_id, form]);

  useEffect(() => {
    if (subjects) {
      form.setFieldsValue({
        subjectName: subjects.subject_name,
        teacherID: subjects.teachers?.[0]?.teacher_id,
      });
      console.log("Subject Name:", subjects.subject_name);
      console.log("Teacher ID:", subjects.teachers?.[0]?.teacher_id);
    }
  }, [subjects, form]);

  const onFinish = async (values: any) => {
    if (!location || !location.latitude || !location.longitude) {
      notification.error({
        message: "ไม่สามารถสร้างห้องได้",
        description: "กรุณาตรวจสอบว่าระบบสามารถดึงข้อมูลพิกัดที่ตั้งได้สำเร็จ",
        placement: "topRight",
      });
      return;
    }

    const formattedStartTime = values.createdTime.tz("Asia/Bangkok").format();
    const formattedEndTime = values.endTime.tz("Asia/Bangkok").format();

    const attendanceData: AttendanceRoom = {
      subject_id: values.subjectID,
      room_name: values.roomName,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      location_lat: location.latitude,
      location_lon: location.longitude,
    };

    try {
      const result = await CreateAttendance(attendanceData);

      if (result.status) {
        notification.success({
          message: "สร้างห้องเช็คชื่อสำเร็จ",
          description: result.message,
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: result.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างห้องเช็คชื่อได้",
        placement: "topRight",
      });
    }
  };

  const disablePastDates = (current: any) => {
    return (
      current &&
      (current < dayjs().startOf("day") || current > dayjs().add(1, "month"))
    );
  };

  const disablePastTimes = (current: any) => {
    const currentHour = dayjs().hour();
    const currentMinute = dayjs().minute();
    const hours: any = [];
    const minutes: any = [];

    if (current.isSame(dayjs(), "day")) {
      for (let i = 0; i < currentHour; i++) {
        hours.push(i);
      }
      for (let i = 0; i < currentMinute; i++) {
        minutes.push(i);
      }
    }

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
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          createdTime: startTime, // Set current time
          endTime: endTime,
          subjectID: subject_id,
          subjectName: subjects?.subject_name,
          roomName: roomName,
          teacherID: subjects?.teachers?.[0]?.teacher_id,
        }}
      >
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

          <Col
            xs={24} // Full width on extra-small screens
            sm={24} // Full width on small screens
            md={12} // Half width on medium and larger screens
          >
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
                    setStartTime(dayjs().locale("en")); // Reset to current time when opening
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col
            xs={24} // Full width on extra-small screens
            sm={24} // Full width on small screens
            md={12} // Half width on medium and larger screens
          >
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
                <LocationMap center={center} />
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
