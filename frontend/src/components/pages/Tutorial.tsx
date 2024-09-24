import React, { useState, useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Spin, Alert } from "antd";
import { Button } from "@chakra-ui/react";

const Tutorial: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Example data or tutorial content
  const tutorialContent = `
    วิธีการสแกน QR Code แล้วล็อกอินผ่านไลน์:
    1. คลิกที่ปุ่ม "Scan QR Code" เพื่อเปิดกล้องของคุณ.
    2. นำกล้องไปสแกน QR Code ที่ได้รับ.
    3. หลังจากสแกนเสร็จ ระบบจะนำคุณเข้าสู่หน้าล็อกอินผ่านไลน์.
  `;

  // Simulate loading of tutorial content
  useEffect(() => {
    // Simulating an API call or data fetching delay
    setTimeout(() => {
      setLoading(false);
      // If there's an error, you can uncomment the line below to simulate an error
      // setError("Failed to load tutorial. Please try again.");
    }, 1000);
  }, []);

  return (
    <Box p={4}>
      <Container maxW={{ base: "100%", md: "container.lg" }} mt={6}>
        <Box
          border={"1px solid rgba(69, 69, 71,0.2)"}
          bg={"white"}
          mb={5}
          display={"flex"}
          alignItems={"center"}
          p={5}
        >
          <Text fontWeight={"bold"} fontSize={"1.5rem"}>
            วิธีการใช้งาน - สแกนแล้วล็อกอินผ่านไลน์
          </Text>
        </Box>
        <Box
          border={"1px solid rgba(69, 69, 71,0.2)"}
          p={0}
          bg={"white"}
          mt={5}
        >
          {loading ? (
            <Spin tip="Loading tutorial..." />
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <Box p={5}>
              <Text whiteSpace="pre-line">{tutorialContent}</Text>
              <Button mt={4} colorScheme="teal" onClick={() => alert('QR Code Scanner Opened!')}>
                Scan QR Code
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Tutorial;
