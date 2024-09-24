import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import "./QrCodeGenerator.css";
import {
  Box,
  Container,
  Text,
  Kbd,
  Divider,
  Button,
  useToast,
} from "@chakra-ui/react";

dayjs.extend(duration);
dayjs.extend(utc);

function QrCodeGenerator(): JSX.Element {
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>(""); // Short URL หลังจากแปลงแล้ว
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const subjectIdFromQuery = queryParams.get("subject_id");
    const roomIdFromQuery = queryParams.get("room_id");
    const durationFromQuery = queryParams.get("duration");

    if (subjectIdFromQuery && roomIdFromQuery) {
      const attendanceUrl = `https://sut-online-attendance-system.vercel.app/attendance/student/${subjectIdFromQuery}/${roomIdFromQuery}`;
      setUrl(attendanceUrl);
      shortenUrl(attendanceUrl);
    }

    if (durationFromQuery) {
      const durationMatch = durationFromQuery.match(/(\d+)m(\d+)s/);
      if (durationMatch) {
        const minutes = parseInt(durationMatch[1], 10);
        const seconds = parseInt(durationMatch[2], 10);
        const totalMilliseconds = (minutes * 60 + seconds) * 1000;
        const calculatedEndTime = dayjs().add(totalMilliseconds, "millisecond");
        setEndTime(calculatedEndTime);
      }
    }
  }, []);

  const shortenUrl = async (longUrl: string) => {
    try {
      const response = await fetch(`https://api.tinyurl.com/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer XIxIse5fNmAaHNzGNy6HNRiAJNiE7Rp5oWpdew5nHwZmuHs98azMpEPCp5bw",
        },
        body: JSON.stringify({
          url: longUrl,
          domain: "tiny.one",
        }),
      });
      const data = await response.json();
      if (data.data) {
        setShortUrl(data.data.tiny_url);
      } else {
        console.error("Error creating short URL:", data);
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

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

  useEffect(() => {
    if (endTime) {
      setCountdown(calculateCountdown(endTime));
      const interval = setInterval(() => {
        setCountdown(calculateCountdown(endTime));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [endTime]);

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

  const handleCopyToClipboard = () => {
    const textToCopy = shortUrl || url;

    if (!textToCopy) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "The path has been copied successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <Box p={4}>
      <Container
        maxW={{ base: "100%", md: "container.lg" }}
        className="no-copy-no-select"
        mt={6}
      >
        <Box
          border={"1px solid rgba(69, 69, 71,0.2)"}
          bg={"white"}
          mb={5}
          display={"flex"}
          alignItems={"center"}
          p={5}
        >
          <Text fontWeight={"bold"} fontSize={"1.5rem"}>
            Scan QR Code to Check into the Room
          </Text>
        </Box>

        <Box border={"1px solid rgba(69, 69, 71,0.2)"} p={7} bg={"white"}>
          <div className="qrcode__input-container">
            <Text>
              <Kbd fontSize={"1.1rem"}>Path: {shortUrl ? shortUrl : url}</Kbd>
            </Text>
            <Button
              size={"smaller"}
              ms={2}
              p={1}
              fontSize={"10px"}
              colorScheme="green"
              onClick={handleCopyToClipboard}
            >
              Copy Path
            </Button>
          </div>
          <Divider style={{ borderWidth: "1px" }} />
          {url && (
            <div className="flex flex-col justify-center items-center">
              <p
                style={{
                  color: "red",
                  fontWeight: "bold",
                  fontSize: "2.4rem",
                  margin: "8px 0px",
                }}
              >
                <strong>Countdown:</strong> {countdown}
              </p>
              <div className="m-5" ref={qrCodeRef}>
                <QRCode value={shortUrl || url} size={400} />
              </div>
              <button
                onClick={handleDownloadQRCode}
                className="qrcode__download-button"
              >
                Download QR Code
              </button>
            </div>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default QrCodeGenerator;
