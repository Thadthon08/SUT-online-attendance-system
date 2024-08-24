import {
  Form,
  Input,
  Button,
  DatePicker,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationMap from "./LocationMap"; // Import LocationMap
import { Skeleton } from "@chakra-ui/react";

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

const { Title } = Typography;

const CreateRoomForm = () => {
  const { subject_id = "" } = useParams<{ subject_id: string }>();
  const subject_name = "วิชาการเขียนโปรแกรม"; // Hardcoded subject name
  const teacherId = localStorage.getItem("teacher_id")?.replace(/"/g, "") || "";
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

      // อัปเดตค่าของฟอร์มเมื่อ roomName เปลี่ยนแปลง
      form.setFieldsValue({
        roomName: newRoomName,
      });
    }

    // Set initial form values
    form.setFieldsValue({
      createdTime: dayjs().locale("en"), // Use Gregorian calendar
      endTime: dayjs().add(2, "minute"),
      subjectID: subject_id,
      teacherID: teacherId,
    });

    // Request geolocation
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
  }, [subject_id, form, endTime, teacherId]);

  const onFinish = (values: any) => {
    const formattedStartTime = values.createdTime.format("YYYY-MM-DD HH:mm:ss");
    const formattedEndTime = values.endTime.format("YYYY-MM-DD HH:mm:ss");

    console.log("Form values:", values);
    console.log("Formatted Start Time:", formattedStartTime);
    console.log("Formatted End Time:", formattedEndTime);
    console.log("Geolocation:", location?.latitude, location?.longitude);
    console.log("subject_id:", subject_id);
    console.log("subject_name:", subject_name);
    console.log("teacher_id:", teacherId);
    console.log("room_name:", roomName);
  };

  // Limit the date range to the present and future only, and up to 1 year in the future
  const disablePastDates = (current: any) => {
    return (
      current &&
      (current < dayjs().startOf("day") || current > dayjs().add(1, "month"))
    );
  };

  // Disable past hours and minutes for the current day
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
        maxWidth: "850px",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 8px 10px 1px rgba(0,0,0,0.5)",
        border: "0.35rem solid #000000",
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
          subjectName: subject_name,
          roomName: roomName,
          teacherID: teacherId,
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Subject Name (Read Only) */}
          <Col span={24}>
            <Form.Item
              name="subjectName"
              rules={[{ required: true }]}
              label="ชื่อวิชา"
            >
              <Input value={subject_name} readOnly />
            </Form.Item>
          </Col>

          {/* Subject ID (Read Only) */}
          <Col span={24}>
            <Form.Item
              name="subjectID"
              label="รหัสวิชา"
              rules={[{ required: true }]}
            >
              <Input value={subject_id} readOnly />
            </Form.Item>
          </Col>

          {/* Room Name (Editable) */}
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

          {/* Start Time Picker */}
          <Col span={12}>
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
                disabledDate={disablePastDates} // Limit date range
                disabledTime={disablePastTimes}
                onOpenChange={(open) => {
                  if (open) {
                    setStartTime(dayjs().locale("en")); // Reset to current time when opening
                  }
                }}
              />
            </Form.Item>
          </Col>

          {/* End Time Picker */}
          <Col span={12}>
            <Form.Item
              name="endTime"
              label="เวลาสิ้นสุดเช็คชื่อ"
              rules={[{ required: true }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={endTime}
                disabledDate={disablePastDates}
                disabledTime={disablePastTimes}
                onChange={(value) => setEndTime(value)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {/* Map Display */}
          <Col span={24}>
            <Form.Item label="ตำแหน่งปัจจุบัน">
              {!location ? (
                <Skeleton height={200} width="full" />
              ) : (
                <LocationMap center={center} />
              )}
            </Form.Item>
          </Col>

          {/* Submit Button */}
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
