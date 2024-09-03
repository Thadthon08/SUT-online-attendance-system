import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import "./QrCodeGenerator.css"; // นำเข้าไฟล์ CSS สำหรับการตกแต่ง

function QrCodeGenerator() {
  const [url, setUrl] = useState("");
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    setUrl(currentUrl);
  }, []);

  // ฟังก์ชันเพื่อดาวน์โหลด QR Code เป็นภาพ
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
          <input
            type="text"
            placeholder="Enter a URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="qrcode__url-input"
          />
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
