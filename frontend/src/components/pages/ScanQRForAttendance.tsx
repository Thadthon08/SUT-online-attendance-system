import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import "./QrCodeGenerator.css";

function QrCodeGenerator(): JSX.Element {
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Use URLSearchParams to get query parameters from the current URL
    const queryParams = new URLSearchParams(window.location.search);
    const subjectIdFromQuery = queryParams.get("subject_id");
    const roomIdFromQuery = queryParams.get("room_id");

    setSubjectId(subjectIdFromQuery);
    setRoomId(roomIdFromQuery);

    if (subjectIdFromQuery && roomIdFromQuery) {
      const attendanceUrl = `http://localhost:5173/attendance/student/${subjectIdFromQuery}/${roomIdFromQuery}`;
      setUrl(attendanceUrl);
    }
  }, []);

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
