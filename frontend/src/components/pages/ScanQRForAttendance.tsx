import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import dayjs, { Dayjs } from "dayjs";  // Import Dayjs for date calculations
import duration from "dayjs/plugin/duration"; // Import Dayjs duration plugin
import utc from "dayjs/plugin/utc"; // Import UTC plugin to handle time zones correctly
import "./QrCodeGenerator.css";

// Extend dayjs to use the duration and utc plugins
dayjs.extend(duration);
dayjs.extend(utc);

function QrCodeGenerator(): JSX.Element {
  const [url, setUrl] = useState<string>("");
  const [endTime, setEndTime] = useState<Dayjs | null>(null); // Use Dayjs for handling time
  const [countdown, setCountdown] = useState<string>(""); // State for countdown display
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const subjectIdFromQuery = queryParams.get("subject_id");
    const roomIdFromQuery = queryParams.get("room_id");
    const durationFromQuery = queryParams.get("duration");

    // Set URL for QR code
    if (subjectIdFromQuery && roomIdFromQuery) {
      const attendanceUrl = `https://sut-online-attendance-system.vercel.app/attendance/student/${subjectIdFromQuery}/${roomIdFromQuery}`;
      setUrl(attendanceUrl);
    }

    // Calculate end time from duration
    if (durationFromQuery) {
      const durationMatch = durationFromQuery.match(/(\d+)m(\d+)s/);
      if (durationMatch) {
        const minutes = parseInt(durationMatch[1], 10);
        const seconds = parseInt(durationMatch[2], 10);
        const totalMilliseconds = (minutes * 60 + seconds) * 1000;
        const calculatedEndTime = dayjs().add(totalMilliseconds, 'millisecond');
        setEndTime(calculatedEndTime); // Set end time
      }
    }
  }, []);

  // Function to calculate the remaining time
  const calculateCountdown = (endTime: Dayjs) => {
    const now = dayjs();
    const diff = endTime.diff(now);

    if (diff <= 0) {
      return "Time's up!";
    }

    const duration = dayjs.duration(diff);
    const hours = String(duration.hours()).padStart(2, "0");
    const minutes = String(duration.minutes()).padStart(2, "0");
    const seconds = String(duration.seconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  // Countdown timer effect
  useEffect(() => {
    if (endTime) {
      setCountdown(calculateCountdown(endTime));
      const interval = setInterval(() => {
        setCountdown(calculateCountdown(endTime));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [endTime]);

  // Handle QR Code Download
  const handleDownloadQRCode = async () => {
    if (qrCodeRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(qrCodeRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qr-code.png";
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="container">
      <div className="qrcode__box">
        <h1 className="qrcode__title">QR Code Generator</h1>
        <div className="qrcode__input-container">
          <p>
            <strong>Path:</strong> {url}
          </p>
        </div>
        {url && (
          <div className="qrcode__output">
            <div className="qrcode__image" ref={qrCodeRef}>
              <QRCode value={url} size={300} />
            </div>
            <p style={{ color: 'red', fontWeight: 'bold', fontSize: '24px' }}>
              <strong>Countdown:</strong> {countdown}
            </p>
            <button
              onClick={handleDownloadQRCode}
              className="qrcode__download-button"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QrCodeGenerator;
